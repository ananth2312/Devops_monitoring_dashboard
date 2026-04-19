import { ec2Client, cloudWatchClient } from '../config/awsClient.js';
import {
    DescribeInstancesCommand,
    RunInstancesCommand,
    DescribeImagesCommand,
    DescribeSubnetsCommand,
    DescribeInstanceTypesCommand
} from "@aws-sdk/client-ec2";
import { GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";
import Server from '../models/Server.js';

// ─────────────────────────────────────────────
// SYNC: Pull all EC2 Instances into MongoDB
// ─────────────────────────────────────────────
export const syncEC2Instances = async () => {
    try {
        const command = new DescribeInstancesCommand({});
        const data = await ec2Client.send(command);

        const instances = [];
        for (const reservation of data.Reservations || []) {
            for (const instance of reservation.Instances || []) {
                // Skip terminated instances — they're gone
                if (instance.State?.Name === 'terminated') continue;

                const nameTag = instance.Tags?.find(tag => tag.Key === 'Name')?.Value || instance.InstanceId;
                const environmentTag = instance.Tags?.find(tag => tag.Key === 'Environment')?.Value || 'production';

                let state = 'offline';
                if (instance.State?.Name === 'running') state = 'healthy';
                else if (instance.State?.Name === 'pending') state = 'warning';
                else if (instance.State?.Name === 'stopped') state = 'offline';

                const serverData = {
                    serverName: nameTag,
                    ipAddress: instance.PublicIpAddress || instance.PrivateIpAddress || "0.0.0.0",
                    status: state,
                    environment: environmentTag.toLowerCase(),
                    location: instance.Placement?.AvailabilityZone || 'us-east-1',
                    os: instance.PlatformDetails || 'Linux/UNIX',
                    cpuUsage: 0,
                    memoryUsage: 0,
                    diskUsage: 0,
                    uptime: 'live'
                };
                instances.push(serverData);
            }
        }

        const updatedServers = [];
        for (const inst of instances) {
            const updated = await Server.findOneAndUpdate(
                { serverName: inst.serverName },
                { $set: inst },
                { returnDocument: 'after', upsert: true }
            );
            updatedServers.push(updated);
        }

        return updatedServers;
    } catch (error) {
        console.error("Error syncing EC2 instances:", error);
        throw error;
    }
};

// ─────────────────────────────────────────────
// Get the first FREE-TIER eligible instance type
// supported in a given AZ
// ─────────────────────────────────────────────
export const getFreeTierInstanceType = async (availabilityZone) => {
    // t2.micro is the classic free-tier type. Check it first.
    const preferred = ['t2.micro', 't3.micro'];
    try {
        const command = new DescribeInstanceTypesCommand({
            Filters: [
                { Name: 'free-tier-eligible', Values: ['true'] }
            ]
        });
        const response = await ec2Client.send(command);
        const freeTierTypes = (response.InstanceTypes || []).map(t => t.InstanceType);

        // Return the first preferred type that is also free-tier eligible
        for (const type of preferred) {
            if (freeTierTypes.includes(type)) return type;
        }

        // Fallback: return first free-tier eligible type found
        return freeTierTypes[0] || 't2.micro';
    } catch (e) {
        console.error("Could not fetch free-tier instance types, defaulting to t2.micro:", e.message);
        return 't2.micro';
    }
};

// ─────────────────────────────────────────────
// Auto-select a compatible subnet — avoid us-east-1e
// which doesn't support t2.micro / t3.micro
// ─────────────────────────────────────────────
export const getCompatibleSubnetId = async () => {
    // AZs known to have limited instance support
    const problematicAZs = ['us-east-1e'];
    try {
        const command = new DescribeSubnetsCommand({});
        const response = await ec2Client.send(command);
        const subnets = response.Subnets || [];

        // Exclude problematic AZs, prefer public subnets
        const goodSubnets = subnets.filter(s => !problematicAZs.includes(s.AvailabilityZone));
        const publicSubnet = goodSubnets.find(s => s.MapPublicIpOnLaunch);
        const chosen = publicSubnet || goodSubnets[0] || subnets[0];

        if (chosen) {
            console.log(`Auto-selected subnet: ${chosen.SubnetId} in AZ: ${chosen.AvailabilityZone}`);
            return chosen.SubnetId;
        }
        return null;
    } catch (e) {
        console.error("Error fetching subnets:", e.message);
        return null;
    }
};

// ─────────────────────────────────────────────
// Get the latest Free-Tier eligible Amazon Linux 2 AMI
// AL2 (not AL2023) is universally free-tier eligible with t2.micro
// ─────────────────────────────────────────────
export const getLatestAmiId = async () => {
    const describeImagesCommand = new DescribeImagesCommand({
        Filters: [
            // Amazon Linux 2 AMI — the officially free-tier eligible AMI
            { Name: "name", Values: ["amzn2-ami-hvm-2.0.*-x86_64-gp2"] },
            { Name: "architecture", Values: ["x86_64"] },
            { Name: "state", Values: ["available"] },
            { Name: "virtualization-type", Values: ["hvm"] }
        ],
        Owners: ["amazon"]
    });

    const response = await ec2Client.send(describeImagesCommand);
    const sortedImages = (response.Images || []).sort(
        (a, b) => new Date(b.CreationDate) - new Date(a.CreationDate)
    );

    if (sortedImages.length > 0) {
        console.log(`Using free-tier AMI: ${sortedImages[0].ImageId} (${sortedImages[0].Name})`);
        return sortedImages[0].ImageId;
    }
    throw new Error("No Amazon Linux 2 free-tier AMIs found in this region.");
};

// ─────────────────────────────────────────────
// LAUNCH: Create a real EC2 instance
// ─────────────────────────────────────────────
export const launchEC2Instance = async (serverName, environment, config = {}) => {
    try {
        // Always use a free-tier eligible AMI unless user explicitly overrides
        const amiId = config.amiId || await getLatestAmiId();

        // Auto-select compatible subnet FIRST (needed to know AZ)
        const subnetId = config.subnetId || await getCompatibleSubnetId();

        // Use t2.micro — universally free-tier eligible with AL2
        const instanceType = config.instanceType || 't2.micro';

        console.log(`🚀 Launching: Name=${serverName}, AMI=${amiId}, Type=${instanceType}, Subnet=${subnetId || 'none'}`);

        const runCommandArgs = {
            ImageId: amiId,
            InstanceType: instanceType,
            MinCount: 1,
            MaxCount: 1,
            TagSpecifications: [
                {
                    ResourceType: "instance",
                    Tags: [
                        { Key: "Name", Value: serverName },
                        { Key: "Environment", Value: environment || "production" }
                    ]
                }
            ]
        };

        if (subnetId) {
            runCommandArgs.SubnetId = subnetId;
        }

        const runCommand = new RunInstancesCommand(runCommandArgs);
        const response = await ec2Client.send(runCommand);
        const instance = response.Instances?.[0] || null;
        console.log(`✅ EC2 instance launched: ${instance?.InstanceId}`);
        return instance;
    } catch (error) {
        console.error("Failed to launch EC2 instance:", error.message);
        throw error;
    }
};

// ─────────────────────────────────────────────
// CloudWatch: Fetch CPU metrics for an instance
// ─────────────────────────────────────────────
export const fetchCloudWatchMetrics = async (instanceId) => {
    const now = new Date();
    const startTime = new Date(now.getTime() - 5 * 60000);

    try {
        const command = new GetMetricStatisticsCommand({
            Namespace: 'AWS/EC2',
            MetricName: 'CPUUtilization',
            Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
            StartTime: startTime,
            EndTime: now,
            Period: 300,
            Statistics: ['Average']
        });
        const response = await cloudWatchClient.send(command);
        return response.Datapoints;
    } catch (err) {
        console.error("Error fetching CW metrics:", err);
        return [];
    }
};

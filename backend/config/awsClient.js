import { EC2Client } from "@aws-sdk/client-ec2";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import dotenv from 'dotenv';
dotenv.config();

// Ensure both access and secret are present if you want to use static credentials
// Otherwise, the default provider will seek IAM roles/profiles naturally
const getCredentials = () => {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && 
        process.env.AWS_ACCESS_KEY_ID !== 'your_access_key_here') {
        return {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        };
    }
    return undefined; // Will fallback to default provider chain
};

// Config for AWS Clients
const awsConfig = {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: getCredentials(),
};

export const ec2Client = new EC2Client(awsConfig);
export const cloudWatchClient = new CloudWatchClient(awsConfig);

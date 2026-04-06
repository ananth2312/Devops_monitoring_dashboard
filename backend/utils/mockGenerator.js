import Server from '../models/Server.js';
import Alert from '../models/Alert.js';
import Log from '../models/Log.js';
import Deployment from '../models/Deployment.js';

export const generateMetrics = async () => {
   // Initial Seeding
   try {
      const serverCount = await Server.countDocuments();
      if (serverCount === 0) {
         console.log('Seeding initial servers...');
         const initialServers = [
            { serverName: "prod-node-1", ipAddress: "10.0.1.12", environment: "production", location: "us-east-1" },
            { serverName: "prod-node-2", ipAddress: "10.0.1.13", environment: "production", location: "us-east-1" },
            { serverName: "staging-1", ipAddress: "10.0.3.5", environment: "staging", location: "us-west-2" }
         ];
         await Server.insertMany(initialServers);

         await Deployment.insertMany([
            { version: "v2.4.1", environment: "production", status: "success" },
            { version: "v2.3.9", environment: "production", status: "failed" }
         ]);
      }

      // Ticking Engine to update metrics every 5 seconds
      setInterval(async () => {
         const servers = await Server.find();
         for (let server of servers) {
            // Randomly oscillate CPU & RAM
            let cpuNudge = (Math.random() - 0.5) * 20; // -10 to +10
            let memoryNudge = (Math.random() - 0.5) * 10;
            
            server.cpuUsage = Math.max(0, Math.min(100, Math.round(server.cpuUsage + cpuNudge)));
            server.memoryUsage = Math.max(0, Math.min(100, Math.round(server.memoryUsage + memoryNudge)));
            
            // Check status bounds
            if (server.cpuUsage > 90 || server.memoryUsage > 90) {
               server.status = 'critical';
               // Add Alert
               await Alert.create({
                  serverId: server._id,
                  serverName: server.serverName,
                  severity: 'high',
                  message: `Critical threshold exceeded on ${server.serverName}. CPU: ${server.cpuUsage}%, RAM: ${server.memoryUsage}%`
               });
               await Log.create({
                  serverId: server._id,
                  serverName: server.serverName,
                  logLevel: 'ERROR',
                  message: `Threshold exceeded bounds. CPU: ${server.cpuUsage}%. Memory: ${server.memoryUsage}%`
               });
            } else if (server.cpuUsage > 75 || server.memoryUsage > 75) {
               server.status = 'warning';
               await Log.create({
                  serverId: server._id,
                  serverName: server.serverName,
                  logLevel: 'WARN',
                  message: `Warning threshold approaching. CPU: ${server.cpuUsage}%. Memory: ${server.memoryUsage}%`
               });
            } else {
               server.status = 'healthy';
               if (Math.random() > 0.8) {
                   await Log.create({
                      serverId: server._id,
                      serverName: server.serverName,
                      logLevel: 'INFO',
                      message: `Health check OK. Latency 14ms.`
                   });
               }
            }

            await server.save();
         }
      }, 5000);
   } catch (error) {
       console.error("Error in mockGenerator:", error);
   }
};

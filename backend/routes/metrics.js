import express from 'express';
import Server from '../models/Server.js';

const router = express.Router();

// Mock generation time-series loop for UI parsing.
// In actual systems, this pulls from a historical DB like Prometheus.
let timeSeriesTick = 0;

router.get('/', async (req, res) => {
    try {
        const servers = await Server.find();
        
        // Sum total metrics for the chart representation
        let totalCpu = 0;
        let totalMem = 0;
        
        servers.forEach(s => {
           totalCpu += s.cpuUsage;
           totalMem += s.memoryUsage;
        });

        const avgCpu = servers.length > 0 ? Math.round(totalCpu / servers.length) : 0;
        const avgMem = servers.length > 0 ? Math.round(totalMem / servers.length) : 0;
        
        timeSeriesTick++;
        const now = new Date();
        const output = {
            time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
            cpu: avgCpu,
            memory: avgMem,
            network: Math.floor(Math.random() * 100), // mocked telemetry
            requests: Math.floor(Math.random() * 100) // mocked telemetry
        };

        res.status(200).json(output);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default router;

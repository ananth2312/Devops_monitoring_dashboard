import express from 'express';
import { syncEC2Instances } from '../services/awsService.js';

const router = express.Router();

router.get('/sync/servers', async (req, res) => {
    try {
        const syncedServers = await syncEC2Instances();
        res.status(200).json({
            message: "Successfully synced with AWS EC2",
            servers: syncedServers
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'CredentialsProviderError') {
             return res.status(401).json({ message: "AWS credentials not configured or valid." });
        }
        res.status(500).json({ message: "Failed to sync with AWS", error: error.message });
    }
});

export default router;

import express from 'express';
import Server from '../models/Server.js';

const router = express.Router();

// GET all servers (Inventory & Dashboard mapping)
router.get('/', async (req, res) => {
   try {
      const servers = await Server.find();
      res.status(200).json(servers);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
});

// POST: Save server to local DB only
// AWS instances are pulled automatically via the sync poller
router.post('/', async (req, res) => {
   const server = req.body;

   if (!server.serverName) {
       return res.status(400).json({ message: "Server Name is required." });
   }

   // Provide a default IP if not supplied
   if (!server.ipAddress) server.ipAddress = "0.0.0.0";

   const newServer = new Server(server);
   try {
      await newServer.save();
      res.status(201).json(newServer);
   } catch (error) {
      res.status(409).json({ message: error.message });
   }
});

router.get('/:id', async (req, res) => {
    try {
        const server = await Server.findById(req.params.id);
        res.status(200).json(server);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
       await Server.findByIdAndDelete(req.params.id);
       res.status(200).json({ message: "Server deleted." });
    } catch (error) {
       res.status(404).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const serverUpdate = req.body;
        
        // Validation (if provided)
        if (serverUpdate.serverName !== undefined && !serverUpdate.serverName) {
            return res.status(400).json({ message: "Server Name cannot be empty." });
        }
        
        if (serverUpdate.ipAddress) {
            const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            if (!ipRegex.test(serverUpdate.ipAddress)) {
                return res.status(400).json({ message: "Invalid IP Address format." });
            }
        }

        const updatedServer = await Server.findByIdAndUpdate(
            req.params.id,
            serverUpdate,
            { new: true }
        );
        res.status(200).json(updatedServer);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

export default router;

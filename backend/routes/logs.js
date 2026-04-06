import express from 'express';
import Log from '../models/Log.js';

const router = express.Router();

router.get('/', async (req, res) => {
   try {
      // Find top 100 recent logs
      const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
      res.status(200).json(logs);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
});

router.post('/', async (req, res) => {
   const log = req.body;
   const newLog = new Log(log);
   try {
      await newLog.save();
      res.status(201).json(newLog);
   } catch (error) {
      res.status(409).json({ message: error.message });
   }
});

router.get('/:id', async (req, res) => {
    try {
        const log = await Log.findById(req.params.id);
        res.status(200).json(log);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
       await Log.findByIdAndDelete(req.params.id);
       res.status(200).json({ message: "Log deleted." });
    } catch (error) {
       res.status(404).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedLog = await Log.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedLog);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

export default router;

import express from 'express';
import Alert from '../models/Alert.js';

const router = express.Router();

router.get('/', async (req, res) => {
   try {
      const alerts = await Alert.find().sort({ timestamp: -1 });
      res.status(200).json(alerts);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
});

router.post('/', async (req, res) => {
   const alert = req.body;
   const newAlert = new Alert(alert);
   try {
      await newAlert.save();
      res.status(201).json(newAlert);
   } catch (error) {
      res.status(409).json({ message: error.message });
   }
});

router.get('/:id', async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        res.status(200).json(alert);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
       await Alert.findByIdAndDelete(req.params.id);
       res.status(200).json({ message: "Alert deleted." });
    } catch (error) {
       res.status(404).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedAlert = await Alert.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedAlert);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

export default router;

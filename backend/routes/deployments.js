import express from 'express';
import Deployment from '../models/Deployment.js';

const router = express.Router();

router.get('/', async (req, res) => {
   try {
      const deployments = await Deployment.find().sort({ timestamp: -1 }).limit(10);
      res.status(200).json(deployments);
   } catch (error) {
      res.status(404).json({ message: error.message });
   }
});

router.post('/', async (req, res) => {
   const dep = req.body;
   const newDep = new Deployment(dep);
   try {
      await newDep.save();
      res.status(201).json(newDep);
   } catch (error) {
      res.status(409).json({ message: error.message });
   }
});

router.get('/:id', async (req, res) => {
    try {
        const dep = await Deployment.findById(req.params.id);
        res.status(200).json(dep);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
       await Deployment.findByIdAndDelete(req.params.id);
       res.status(200).json({ message: "Deployment deleted." });
    } catch (error) {
       res.status(404).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedDep = await Deployment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedDep);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

export default router;

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import serverRoutes from './routes/servers.js';
import metricRoutes from './routes/metrics.js';
import logRoutes from './routes/logs.js';
import deploymentRoutes from './routes/deployments.js';
import alertRoutes from './routes/alerts.js';
import process from 'process';
import { generateMetrics } from './utils/mockGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devops-monitoring-dashboard';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Compass successfully');
    // Start generating sample data
    generateMetrics();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/alerts', alertRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', stack: err.stack, errorMessage: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

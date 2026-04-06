import mongoose from 'mongoose';

const deploymentSchema = new mongoose.Schema({
  version: { type: String, required: true },
  environment: { type: String, required: true, default: 'production' },
  status: { type: String, enum: ['success', 'in_progress', 'failed'], required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Deployment', deploymentSchema);

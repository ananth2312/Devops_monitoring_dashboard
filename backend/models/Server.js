import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  serverName: { type: String, required: true },
  ipAddress: { type: String, required: true },
  status: { type: String, enum: ['healthy', 'warning', 'critical', 'offline'], default: 'healthy' },
  cpuUsage: { type: Number, default: 0 },
  memoryUsage: { type: Number, default: 0 },
  diskUsage: { type: Number, default: 0 },
  environment: { type: String, default: 'production' },
  location: { type: String, default: 'us-east-1' },
  requests: { type: Number, default: 0 },
  uptime: { type: String, default: '1d 0h' }
}, { timestamps: true });

export default mongoose.model('Server', serverSchema);

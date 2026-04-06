import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  serverName: { type: String, required: true },
  logLevel: { type: String, enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Log', logSchema);

import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  serverName: { type: String, required: true },
  severity: { type: String, enum: ['disaster', 'high', 'average', 'warning', 'info'], required: true },
  message: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Alert', alertSchema);

// models/messageModel.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Message title is required.'], trim: true },
  content: { type: String, required: [true, 'Message content is required.'] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true, index: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', default: null, index: true },
}, { timestamps: true });

messageSchema.index({ recipient: 1, createdAt: -1 }); // common read path
messageSchema.index({ author: 1, createdAt: -1 });    // admin/author dashboards

const Message = mongoose.model('Message', messageSchema);
export default Message;

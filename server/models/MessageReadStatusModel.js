// models/messageReadStatusModel.js
import mongoose from 'mongoose';

const messageReadStatusSchema = new mongoose.Schema({
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'employees', required: true, index: true },
  readAt: { type: Date, default: Date.now },
});

// Prevent duplicates per user/message
messageReadStatusSchema.index({ userId: 1, messageId: 1 }, { unique: true });

const MessageReadStatus = mongoose.model('MessageReadStatus', messageReadStatusSchema);
export default MessageReadStatus;

// controllers/messageController.js
import mongoose from 'mongoose';
import Message from '../models/messageModel.js';
import MessageReadStatus from '../models/messageReadStatusModel.js';

// Create
export const createMessage = async (req, res) => {
  try {
    const { title, content, recipientId } = req.body;
    const authorId = req.userId;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const msg = await Message.create({
      title: title.trim(),
      content: content.trim(),
      author: authorId,
      recipient: recipientId || null,
    });

    return res.status(201).json({ success: true, message: 'Message sent successfully.', data: msg });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// List visible messages
export const getAllMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const role = req.role;

    // Admin-only view if requested
    const adminOnly = req.query.adminOnly === 'true';
    if (adminOnly && role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const query = adminOnly
      ? {} // admins see all
      : { $or: [{ recipient: userId }, { recipient: null }] };

    const messages = await Message.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean(); // faster reads since we don't modify docs

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// Unread messages for user
export const getUnreadMessages = async (req, res) => {
  try {
    const userId = req.userId;

    // Find read message IDs for this user
    const readStatuses = await MessageReadStatus.find({ userId }).select('messageId').lean();
    const readIds = readStatuses.map((x) => x.messageId);

    // Fetch messages that are visible to the user and not read
    const messages = await Message.find({
      _id: { $nin: readIds },
      $or: [{ recipient: userId }, { recipient: null }],
    })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// Mark read
export const markMessageAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ success: false, message: 'Invalid message ID format.' });
    }

    // Upsert to avoid race and leverage unique index
    await MessageReadStatus.updateOne(
      { userId, messageId },
      { $setOnInsert: { userId, messageId, readAt: new Date() } },
      { upsert: true }
    );

    return res.status(201).json({ success: true, message: 'Message marked as read successfully.' });
  } catch (error) {
    if (error?.code === 11000) {
      // duplicate = already read
      return res.status(200).json({ success: true, message: 'Message was already marked as read.' });
    }
    return res.status(500).json({ success: false, message: 'Server error while marking message as read.' });
  }
};

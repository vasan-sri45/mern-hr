import mongoose from 'mongoose';
import Ticket from '../models/ticketModel.js';
import Employee from '../models/employeeModel.js';

// Create
export const createTicket = async (req, res) => {
  try {
    const { department, requestType, date, remark } = req.body;
    const createdBy = req.userId;

    const dpt = String(department || '').trim();
    const rtype = String(requestType || '').trim();
    const rmk = String(remark || '').trim();
    const dt = new Date(date);

    if (!dpt || !rtype || !rmk || Number.isNaN(dt.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const ticket = new Ticket({ department: dpt, requestType: rtype, date: dt, remark: rmk, createdBy });
    const savedTicket = await ticket.save();

    return res.status(201).json({ success: true, message: 'Ticket created successfully', data: savedTicket });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: 'Validation failed', messages });
    }
    return res.status(500).json({ success: false, message: 'Server error while creating ticket.' });
  }
};

// List my tickets
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.userId })
      .select('ticketNo department requestType date remark status createdAt createdBy')
      .sort({ createdAt: -1 }) 
      .populate('createdBy', 'empId name')
      .lean();

    return res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while fetching tickets.' });
  }
};

// Get ticket by ID with RBAC
export const getTicketById = async (req, res) => {
  try {
    const ticketId = (req.params.id || '').trim();
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ success: false, message: `Invalid ticket ID format: ${req.params.id}` });
    }

    const ticket = await Ticket.findById(ticketId)
      .populate('createdBy', 'empId name emailId role')
      .lean();

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const isOwner = String(ticket.createdBy._id) === String(req.userId);
    const isAdmin = req.user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'You are not authorized to view this ticket.' });
    }

    return res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: `Invalid ticket ID format: ${req.params.id}` });
    }
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Update with RBAC
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, remark } = req.body;

  const updateFields = {};
  if (status) updateFields.status = status;
  if (remark !== undefined) updateFields.remark = String(remark).trim();

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ success: false, message: 'No update fields provided.' });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: `Invalid ticket ID format: ${id}` });
    }

    const ticket = await Ticket.findById(id).select('createdBy');
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const isOwner = String(ticket.createdBy) === String(req.userId);
    const isAdmin = req.user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this ticket.' });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('createdBy', 'empId name');

    return res.status(200).json({ success: true, message: 'Ticket updated successfully', data: updatedTicket });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }
    return res.status(500).json({ success: false, message: 'Server error while updating ticket.' });
  }
};

// Delete with RBAC
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: `Invalid ticket ID format: ${id}` });
    }

    const ticket = await Ticket.findById(id).select('createdBy');
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    const isOwner = String(ticket.createdBy) === String(req.userId);
    const isAdmin = req.user?.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'User not authorized to delete this ticket.' });
    }

    await Ticket.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Ticket deleted successfully', id });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while deleting ticket.' });
  }
};

// Admin: list all tickets
export const getAllTickets = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const tickets = await Ticket.find()
      .select('ticketNo department requestType date remark status createdAt createdBy')
      .sort({ createdAt: -1 })
      .populate('createdBy', 'empId name')
      .lean();

    return res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error while fetching tickets.' });
  }
};

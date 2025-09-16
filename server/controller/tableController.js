import mongoose from 'mongoose';
import Table from '../models/tableModel.js';

const buildUpdate = (body, updaterId) => {
  const { heading, title, description, content, employee_id, checkList } = body;
  const patch = {};
  if (heading !== undefined) patch.heading = String(heading).trim();
  if (title !== undefined) patch.title = String(title).trim();
  if (description !== undefined) patch.description = String(description);
  if (content !== undefined) patch.content = String(content);
  if (employee_id !== undefined) patch.employee_id = employee_id; // expect ObjectId string
  if (checkList !== undefined) patch.checkList = !!checkList;
  patch.lastUpdatedBy = updaterId;
  return patch;
};

// POST /api/tables
export const createTableEntry = async (req, res) => {
  try {
    const employee_id = req.userId;
    const heading = req.body.heading !== undefined ? String(req.body.heading).trim() : undefined;
    const title = req.body.title !== undefined ? String(req.body.title).trim() : undefined;
    const description = req.body.description !== undefined ? String(req.body.description) : undefined;
    const content = req.body.content !== undefined ? String(req.body.content) : undefined;

    if (!title || !employee_id) {
      return res.status(400).json({ success: false, message: 'Title and employee_id are required fields.' });
    }

    const newEntry = new Table({ heading, title, description, content, employee_id });
    const savedEntry = await newEntry.save();
    return res.status(201).json({ success: true, data: savedEntry });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating table entry', error: error.message });
  }
};

// GET /api/tables
export const getAllTableEntries = async (req, res) => {
  try {
    // Optional owner scoping:
    // const query = req.user?.role === 'admin' ? {} : { employee_id: req.userId };
    const query = {};
    const entries = await Table.find(query)
      .sort({ createdAt: -1 })
      .populate('employee_id', 'name emailId empId')
      .populate('lastUpdatedBy', 'empId name')
      .lean();

    return res.status(200).json({ success: true, data: entries });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching table entries', error: error.message });
  }
};

// GET /api/tables/:id
export const getTableEntryById = async (req, res) => {
  try {
    const id = (req.params.id || '').trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const entry = await Table.findById(id)
      .populate('employee_id', 'empId name')
      .populate('lastUpdatedBy', 'empId name')
      .lean();

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Table entry not found' });
    }

    // Optional RBAC
    // const isOwner = String(entry.employee_id?._id) === String(req.userId);
    // const isAdmin = req.user?.role === 'admin';
    // if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });

    return res.status(200).json({ success: true, data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching table entry', error: error.message });
  }
};

// PUT /api/tables/:id
export const updateTableEntry = async (req, res) => {
  try {
    const id = (req.params.id || '').trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const updaterId = req.userId;
    const updateData = buildUpdate(req.body, updaterId);

    // Optional RBAC
    // const current = await Table.findById(id).select('employee_id');
    // if (!current) return res.status(404).json({ success: false, message: 'Table entry not found' });
    // const isOwner = String(current.employee_id) === String(req.userId);
    // const isAdmin = req.user?.role === 'admin';
    // if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });

    const updatedEntry = await Table.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, omitUndefined: true }
    )
      .populate('employee_id', 'name emailId empId')
      .populate('lastUpdatedBy', 'empId name');

    if (!updatedEntry) {
      return res.status(404).json({ success: false, message: 'Table entry not found' });
    }

    return res.status(200).json({ success: true, data: updatedEntry });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    return res.status(500).json({ success: false, message: 'Error updating table entry', error: error.message });
  }
};

// DELETE /api/tables/:id
export const deleteTableEntry = async (req, res) => {
  try {
    const id = (req.params.id || '').trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    // Optional RBAC as in update

    const deletedEntry = await Table.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ success: false, message: 'Table entry not found' });
    }
    return res.status(200).json({ success: true, message: 'Table entry successfully deleted', id });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting table entry', error: error.message });
  }
};

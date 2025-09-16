import express from 'express';
import {
  createTableEntry,
  getAllTableEntries,
  getTableEntryById,
  updateTableEntry,
  deleteTableEntry
} from '../controller/tableController.js';
import userAuth from '../middleware/userAuth.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require authentication
router.use(userAuth);

// Create a row (admin only)
router.post('/row', createTableEntry);

// Read all rows (consider admin only; or relax to owner scope in controller)
router.get('/row', getAllTableEntries);

// Read single row (allow authenticated users; controller can enforce owner/admin)
router.get('/row/:id', getTableEntryById);

// Update a row (allow authenticated; controller enforces owner/admin)
router.put('/row/:id', updateTableEntry);

// Delete a row (admin only)
router.delete('/row/:id', adminAuth, deleteTableEntry);

export default router;

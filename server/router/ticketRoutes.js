import express from 'express';
import {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getAllTickets
} from '../controller/ticketController.js';
import userAuth from '../middleware/userAuth.js';
import {adminAuth} from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/create',userAuth,adminAuth, createTicket);
router.get('/my/ticket',userAuth, getMyTickets);
router.get('/ticket/:id',userAuth, getTicketById);
router.put('/ticket/:id',userAuth, updateTicket);
router.delete('/ticket/:id', userAuth, deleteTicket);
router.get('/get', userAuth, adminAuth, getAllTickets );

export default router;
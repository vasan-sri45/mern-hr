import express from 'express';
import { createMessage, getAllMessages, markMessageAsRead, getUnreadMessages } from '../controller/messageController.js';
import userAuth from '../middleware/userAuth.js'; 
import { adminAuth } from '../middleware/adminAuth.js'; 

const router = express.Router();


router.post('/create', userAuth,adminAuth, createMessage);
router.get('/get', userAuth, getAllMessages);
router.post('/:id/read',userAuth, markMessageAsRead);
router.get('/read', userAuth, getUnreadMessages);

export default router;

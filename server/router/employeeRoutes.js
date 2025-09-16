import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {getEmployeeTasks} from '../controller/userController.js';

const router = express.Router();

router.get('/data/task/:id', userAuth,getEmployeeTasks);

export default router;

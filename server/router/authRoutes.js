import express from 'express';
import {createUser, employeeLogin, employeeLogout, resetPassword, forgotPassword} from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';


const router = express.Router();

router.post('/login/employee',employeeLogin);
router.post('/logout/employee',employeeLogout);
router.post('/create/employee',userAuth, createUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
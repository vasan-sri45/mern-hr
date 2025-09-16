import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { punchIn, punchOut, getAttendanceRecords, getTodaysAttendance, getAttendanceHistory, getMonthlyAttendanceStats, getMonthlyReportForAllEmployees } from '../controller/attendnceController.js';

const router = express.Router();

router.post('/punch-in',userAuth, punchIn);
router.put('/punch-out',userAuth,punchOut);
router.get('/punch', userAuth, getAttendanceHistory);
router.get('/punch/today', userAuth, getTodaysAttendance);
router.get('/stats/monthly', userAuth, getMonthlyAttendanceStats); 
router.get('/report/monthly', userAuth, getMonthlyReportForAllEmployees);

export default router;
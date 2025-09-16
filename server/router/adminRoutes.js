import express from 'express';
import { deleteTask, getTask,  updateTask, taskCreated } from '../controller/taskController.js';
import { getMonthlyOverviewAllEmployees, getMyMonthlyReport} from '../controller/taskReportController.js';
import userAuth from '../middleware/userAuth.js';
import {adminAuth} from '../middleware/adminAuth.js';
import { getEmployees } from '../controller/userController.js';
import { upload } from '../helpers/cloudinary.js';

const router = express.Router();

router.get('/get/task', userAuth, getTask);
router.put('/update/task/:id', upload.fields([
  { name: 'document', maxCount: 5 }
]),userAuth, updateTask);
router.delete('/delete/task/:id',userAuth,deleteTask);
router.get('/employees',userAuth,getEmployees);
router.post('/task/create-with-image', upload.fields([
  { name: 'document', maxCount: 5 }
]),userAuth,taskCreated);
router.get('/task/count',userAuth, adminAuth,getMonthlyOverviewAllEmployees);
// router.get('/task/stats/employee/:employeeId', userAuth, adminAuth, getEmployeeMonthlyReport);

// Employee/Admin: self detailed monthly report
router.get('/task/stats/me', userAuth, getMyMonthlyReport);
router.use((req, res) => {
  console.log('Unmatched route:', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
});
export default router;


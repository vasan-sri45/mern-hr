import express from 'express';
import {createPersonalInfo, updatePersonalInfo, getPersonalInfo} from '../controller/personalController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/about',userAuth,createPersonalInfo);
router.put('/update',userAuth, updatePersonalInfo);
router.get('/get',userAuth, getPersonalInfo);

export default router;
import express from 'express';
import { upload } from '../helpers/cloudinary.js';
import { folderCreated, getFolder, updateFolder, deleteFolder } from '../controller/folderController.js';
import userAuth from '../middleware/userAuth.js';
import {adminAuth} from '../middleware/adminAuth.js';

const router = express.Router();

// Multiple files from a single input named "document"
router.post('/create', upload.fields([{ name: 'document', maxCount: 5 }]),userAuth, folderCreated);
router.get('/get',userAuth, getFolder);
router.put('/update/:id', upload.fields([{ name: 'document', maxCount: 5 }]),userAuth, updateFolder);
// router.put(
//   '/update/:id',
//   userAuth,                                  // authenticate first (best practice)
//   upload.array('document', 5),               // make req.files an array
//   updateFolder
// );
router.delete('/delete/:id',userAuth,adminAuth, deleteFolder);

export default router;

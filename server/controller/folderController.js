import { uploadToCloudinary, cloudinary } from '../helpers/cloudinary.js';
import folderModel from '../models/folderModel.js';
import employeeModel from '../models/employeeModel.js';

export const folderCreated = async (req, res, next) => {
  const { title } = req.body;
  console.log(req.userId)
  try {
    if (!title) return res.status(400).json({ success: false, message: 'Missing details...' });

    if (!req.userId) return res.status(401).json({ success: false, message: 'Authentication required' });
    
    const employee = await employeeModel.findById(req.userId).select('_id');
    if (!employee) return res.status(401).json({ success: false, message: 'Invalid user' }); // auth check[4]

    // Multer upload.fields -> req.files is an object: { document: File[] }
    const files = Array.isArray(req.files?.document) ? req.files.document : []; // correct source[2]
    const documents = [];
    for (const f of files) {
      const result = await uploadToCloudinary(f.buffer, f.mimetype, f.originalname); // Cloudinary returns secure_url/public_id[7][6]
      documents.push({
        url: result.secure_url,
        publicId: result.public_id,
        originalName: f.originalname,
        mimetype: f.mimetype,
      });
    }

    const folder = await folderModel.create({
      title,
      assignedTo: req.userId,
      documents,
    });

    return res.status(201).json({ success: true, message: 'Successfully created', folder });

  } catch (error) {
    return next(error);
  }
};

// export const getFolder = async (req, res, next) => {
//   try {
//     if (!req.userId) return res.status(401).json({ success: false, message: 'Authentication required' });

//   const user = await employeeModel.findById(req.userId).select('_id role');
//   if (!user) return res.status(401).json({ success: false, message: 'Invalid user' }); // auth check[4]

//   const isAdmin = user.role === 'admin';
//   const query = isAdmin ? {} : { assignedTo: req.userId };

//   const folders = await folderModel.find(query).populate('assignedTo', 'name empId');
//   return res.status(200).json({ success: true, folders });

//   } catch (err) {
//     return next(err);
//   }
// };

export const getFolder = async (req, res, next) => {
  try {
    if (!req.userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    // Everyone sees all folders (common to all)
    const folders = await folderModel.find({}).populate('assignedTo', 'name empId');
    return res.status(200).json({ success: true, folders });
  } catch (err) {
    return next(err);
  }
};


// controller: updateFolder
export const updateFolder = async (req, res, next) => {
  try {
    if (!req.userId) return res.status(401).json({ success: false, message: 'Authentication required' }); // auth [2]
    const { id } = req.params;
    const folder = await folderModel.findById(id);
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' }); // lookup [2]

    const replace = req.body.replaceDocuments === 'true' || req.body.replaceDocuments === true; // flag from form [2]

    // targeted deletions (optional)
    const { deletedDocuments } = req.body;
    if (!replace && deletedDocuments && deletedDocuments.length > 0) {
      const ids = Array.isArray(deletedDocuments) ? deletedDocuments : JSON.parse(deletedDocuments);
      await Promise.all(ids.map(pid => cloudinary.uploader.destroy(pid, { resource_type: 'raw', invalidate: true })));
      folder.documents = (folder.documents || []).filter(d => !ids.includes(d.publicId));
    }

    // replace-all
    if (replace && folder.documents?.length) {
      await Promise.all(
        folder.documents.map(d => {
          const type = d.mimetype?.startsWith('image/') ? 'image' : d.mimetype?.startsWith('video/') ? 'video' : 'raw';
          return cloudinary.uploader.destroy(d.publicId, { resource_type: type, invalidate: true });
        })
      );
      folder.documents = [];
    }

    // add new docs – read from fields('document')
    const files = Array.isArray(req.files) ? req.files : (req.files?.document || (req.file ? [req.file] : [])); // Multer shape [3]
    if (files.length) {
      const results = await Promise.all(
        files.map(f =>
          uploadToCloudinary(f.buffer, {
            resource_type: 'auto',
            filename_override: f.originalname,
            use_filename: true,
            unique_filename: true,
          })
        )
      );
      const newDocs = results.map((r, i) => ({
        url: r.secure_url,
        publicId: r.public_id,
        originalName: files[i].originalname,
        mimetype: files[i].mimetype,
      }));
      folder.documents = (folder.documents || []).concat(newDocs);
    }

    if (req.body.title !== undefined) folder.title = req.body.title; // title update [2]
    await folder.save();
    return res.status(200).json({ success: true, folder }); // consistent payload [2]
  } catch (err) {
    return next(err); // surface actual 500 cause in logs [2]
  }
};


export const deleteFolder = async (req, res, next) => {
  try {
    if (!req.userId) return res.status(401).json({ success: false, message: 'Authentication required' });
    
    const folder = await folderModel.findById(req.params.id);
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });

    for (const doc of folder.documents || []) {
      const type = doc.mimetype?.startsWith('image/')
        ? 'image'
        : doc.mimetype?.startsWith('video/')
        ? 'video'
        : 'raw';
      try {
        await cloudinary.uploader.destroy(doc.publicId, { resource_type: type, invalidate: true }); // Cloudinary destroy[6]
      } catch (_) {}
    }

    await folderModel.findByIdAndDelete(req.params.id);
    return res.status(204).send();

  } catch (error) {
    return next(error);
  }
};

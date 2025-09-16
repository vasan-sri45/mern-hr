// helpers/cloudinary.js
import dotenv from 'dotenv';
dotenv.config();
import cloud from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';

const cloudinary = cloud.v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage + 10MB per-file limit
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // adjust max files
});

const uploadToCloudinary = (buffer, opts = {}) => {
  const options = {
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true,
    // folder: 'uploads/tasks',
    ...opts,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export { upload, uploadToCloudinary, cloudinary };



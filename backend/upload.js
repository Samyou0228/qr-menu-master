import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

let upload;

// Check if Cloudinary credentials are valid (basic check)
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'qr-menu',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
  });

  upload = multer({ storage: storage });
} else {
  // Fallback to local storage if Cloudinary is not configured or fails
  console.warn('Cloudinary credentials missing or invalid. Using local storage.');
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = 'uploads/';
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  upload = multer({ storage: storage });
}

// Temporary: Forcing local storage to bypass 500 error until credentials are fixed
// Comment this block out to use Cloudinary
const localStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = 'uploads/';
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});
upload = multer({ storage: localStorage });


export default upload;

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Resume storage
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'placementai/resumes',
    allowed_formats: ['pdf', 'docx', 'doc'],
    resource_type: 'raw',
  },
});

// Profile picture storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'placementai/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }],
  },
});

// Certificate storage
const certificateStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'placementai/certificates',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto',
  },
});

const uploadResume = multer({ storage: resumeStorage, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadProfile = multer({ storage: profileStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadCertificate = multer({ storage: certificateStorage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { cloudinary, uploadResume, uploadProfile, uploadCertificate };

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { uploadResume } = require('../config/cloudinary');
const { uploadResume: uploadResumeCtrl, getResumes, getResume, improveResume, deleteResume } = require('../controllers/resume.controller');

router.post('/upload', protect, uploadResume.single('resume'), uploadResumeCtrl);
router.get('/', protect, getResumes);
router.get('/:id', protect, getResume);
router.post('/:id/improve', protect, improveResume);
router.delete('/:id', protect, deleteResume);

module.exports = router;

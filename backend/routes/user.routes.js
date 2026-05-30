const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { uploadProfile } = require('../config/cloudinary');
const User = require('../models/user.model');

// Get profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// Update profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'location', 'college', 'degree', 'branch', 'cgpa', 'graduationYear',
      'technicalSkills', 'softSkills', 'linkedinUrl', 'githubUrl', 'portfolioUrl'];
    const updates = {};
    allowedFields.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// Upload avatar
router.post('/avatar', protect, uploadProfile.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true });
    res.json({ success: true, avatar: user.avatar });
  } catch (err) { next(err); }
});

// Get leaderboard
router.get('/leaderboard', protect, async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true, role: 'student' })
      .select('name avatar college placementReadiness codingScore aptitudeScore streak badges')
      .sort({ placementReadiness: -1 })
      .limit(20);
    res.json({ success: true, leaderboard: users });
  } catch (err) { next(err); }
});

// Get dashboard stats
router.get('/dashboard', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.calculateReadiness();
    await user.save({ validateBeforeSave: false });

    const Resume = require('../models/resume.model');
    const Interview = require('../models/interview.model');
    const TestResult = require('../models/testResult.model');

    const [resumeCount, interviewCount, testCount] = await Promise.all([
      Resume.countDocuments({ userId: req.user._id }),
      Interview.countDocuments({ userId: req.user._id }),
      TestResult.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      success: true,
      stats: {
        resumeScore: user.resumeScore,
        aptitudeScore: user.aptitudeScore,
        codingScore: user.codingScore,
        interviewScore: user.interviewScore,
        placementReadiness: user.placementReadiness,
        streak: user.streak,
        resumeCount,
        interviewCount,
        testCount,
      },
      user,
    });
  } catch (err) { next(err); }
});

module.exports = router;

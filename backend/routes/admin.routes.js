const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const Resume = require('../models/resume.model');
const Interview = require('../models/interview.model');
const TestResult = require('../models/testResult.model');
const Job = require('../models/job.model');
const Company = require('../models/company.model');
const Question = require('../models/question.model');

// Admin: Get all users
router.get('/users', protect, adminOnly, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'student' };
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total });
  } catch (err) { next(err); }
});

// Admin: Platform stats
router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const [totalUsers, totalResumes, totalInterviews, totalTests, totalJobs] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Resume.countDocuments(),
      Interview.countDocuments(),
      TestResult.countDocuments(),
      Job.countDocuments(),
    ]);
    const avgReadiness = await User.aggregate([{ $match: { role: 'student' } }, { $group: { _id: null, avg: { $avg: '$placementReadiness' } } }]);
    res.json({
      success: true,
      stats: {
        totalUsers, totalResumes, totalInterviews, totalTests, totalJobs,
        avgReadiness: Math.round(avgReadiness[0]?.avg || 0),
      }
    });
  } catch (err) { next(err); }
});

// Admin: Create question
router.post('/questions', protect, adminOnly, async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, question });
  } catch (err) { next(err); }
});

// Admin: Create company
router.post('/companies', protect, adminOnly, async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, company });
  } catch (err) { next(err); }
});

module.exports = router;

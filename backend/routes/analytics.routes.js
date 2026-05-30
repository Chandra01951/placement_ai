const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const TestResult = require('../models/testResult.model');
const Interview = require('../models/interview.model');
const Resume = require('../models/resume.model');

router.get('/progress', protect, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [aptitudeTests, codingTests, interviews, resumes] = await Promise.all([
      TestResult.find({ userId, type: 'aptitude', createdAt: { $gte: thirtyDaysAgo } }).sort({ createdAt: 1 }),
      TestResult.find({ userId, type: 'coding', createdAt: { $gte: thirtyDaysAgo } }).sort({ createdAt: 1 }),
      Interview.find({ userId, status: 'completed', createdAt: { $gte: thirtyDaysAgo } }).sort({ createdAt: 1 }),
      Resume.find({ userId, createdAt: { $gte: thirtyDaysAgo } }).sort({ createdAt: 1 }),
    ]);

    const aptitudeProgress = aptitudeTests.map(t => ({ date: t.createdAt, score: t.score }));
    const interviewProgress = interviews.map(i => ({ date: i.createdAt, score: i.scores?.overall || 0 }));
    const resumeProgress = resumes.map(r => ({ date: r.createdAt, score: r.resumeScore }));

    res.json({
      success: true,
      progress: {
        aptitude: aptitudeProgress,
        interview: interviewProgress,
        resume: resumeProgress,
        totalTests: aptitudeTests.length + codingTests.length,
        totalInterviews: interviews.length,
      }
    });
  } catch (err) { next(err); }
});

module.exports = router;

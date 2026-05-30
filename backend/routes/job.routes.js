const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth.middleware');
const Job = require('../models/job.model');
const User = require('../models/user.model');

// Get jobs with AI match score
router.get('/', protect, async (req, res, next) => {
  try {
    const { type, location, search, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, 'i');
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { company: new RegExp(search, 'i') },
      { skills: { $in: [new RegExp(search, 'i')] } },
    ];

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Job.countDocuments(filter);

    // Calculate AI match score
    const user = await User.findById(req.user._id);
    const jobsWithScore = jobs.map(job => {
      const userSkills = user.technicalSkills || [];
      const jobSkills = job.skills || [];
      const matchedSkills = jobSkills.filter(s => userSkills.some(us => us.toLowerCase().includes(s.toLowerCase())));
      const matchScore = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 50;
      return { ...job.toObject(), matchScore, matchedSkills };
    });

    res.json({ success: true, jobs: jobsWithScore, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// Admin: create job
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, job });
  } catch (err) { next(err); }
});

router.get('/:id', protect, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) { next(err); }
});

module.exports = router;

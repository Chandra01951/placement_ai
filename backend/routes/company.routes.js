const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Company = require('../models/company.model');
const { getAIResponse } = require('../utils/ai');

router.get('/', protect, async (req, res, next) => {
  try {
    const companies = await Company.find({ isActive: true }).select('name logo industry averagePackage roles');
    res.json({ success: true, companies });
  } catch (err) { next(err); }
});

router.get('/:name', protect, async (req, res, next) => {
  try {
    const company = await Company.findOne({ name: new RegExp(req.params.name, 'i'), isActive: true });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, company });
  } catch (err) { next(err); }
});

// AI generate prep roadmap for company
router.post('/:name/roadmap', protect, async (req, res, next) => {
  try {
    const { targetRole, weeks = 8 } = req.body;
    const prompt = `Create a ${weeks}-week preparation roadmap for ${req.params.name} ${targetRole} interview.
Return JSON: {
  "roadmap": [{"week": 1, "focus": "topic", "topics": [], "resources": [], "tasks": []}],
  "importantTopics": [],
  "tipps": []
}`;
    const aiResp = await getAIResponse(prompt);
    const roadmap = JSON.parse(aiResp.replace(/```json|```/g, '').trim());
    res.json({ success: true, roadmap });
  } catch (err) { next(err); }
});

module.exports = router;

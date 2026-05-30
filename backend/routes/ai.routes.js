const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getCareerAdvice, chat, skillGapAnalysis, predictSalary, generateCoverLetter, getDailyChallenge } = require('../controllers/ai.controller');

router.post('/career-advice', protect, getCareerAdvice);
router.post('/chat', protect, chat);
router.post('/skill-gap', protect, skillGapAnalysis);
router.post('/salary-predict', protect, predictSalary);
router.post('/cover-letter', protect, generateCoverLetter);
router.get('/daily-challenge', protect, getDailyChallenge);

module.exports = router;

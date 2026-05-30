const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { generateInterview, submitAnswer, completeInterview, getInterviews, getInterview } = require('../controllers/interview.controller');

router.post('/generate', protect, generateInterview);
router.post('/:id/answer', protect, submitAnswer);
router.post('/:id/complete', protect, completeInterview);
router.get('/', protect, getInterviews);
router.get('/:id', protect, getInterview);

module.exports = router;

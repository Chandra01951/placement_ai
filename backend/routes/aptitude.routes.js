const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Question = require('../models/question.model');
const TestResult = require('../models/testResult.model');
const User = require('../models/user.model');
const { getAIResponse } = require('../utils/ai');

// Get aptitude questions
router.get('/questions', protect, async (req, res, next) => {
  try {
    const { category, difficulty, limit = 20 } = req.query;
    const filter = { type: 'aptitude', isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    const questions = await Question.find(filter).limit(Number(limit)).select('-correctAnswer -solution');
    res.json({ success: true, questions });
  } catch (err) { next(err); }
});

// Get categories
router.get('/categories', protect, (req, res) => {
  res.json({
    success: true,
    categories: [
      { id: 'quantitative', name: 'Quantitative Aptitude', icon: '📊', questionCount: 50 },
      { id: 'logical', name: 'Logical Reasoning', icon: '🧠', questionCount: 40 },
      { id: 'verbal', name: 'Verbal Ability', icon: '📝', questionCount: 30 },
    ]
  });
});

// Submit test
router.post('/submit', protect, async (req, res, next) => {
  try {
    const { answers, category, timeTaken } = req.body;
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let correct = 0;
    const processedAnswers = answers.map(a => {
      const q = questions.find(q => q._id.toString() === a.questionId);
      const isCorrect = q && q.correctAnswer === a.selectedAnswer;
      if (isCorrect) correct++;
      return { questionId: a.questionId, selectedAnswer: a.selectedAnswer, isCorrect, timeTaken: a.timeTaken };
    });

    const score = Math.round((correct / answers.length) * 100);

    // AI analysis
    let aiAnalysis = { weakAreas: [], strongAreas: [], suggestions: ['Practice more regularly'] };
    try {
      const wrongCategories = answers.filter((a, i) => !processedAnswers[i].isCorrect).map(a => a.category);
      const prompt = `A student scored ${score}% in a ${category} aptitude test. Wrong questions categories: ${wrongCategories.join(', ')}.
Return JSON: {"weakAreas": [], "strongAreas": [], "suggestions": []}`;
      const aiResp = await getAIResponse(prompt);
      aiAnalysis = JSON.parse(aiResp.replace(/```json|```/g, '').trim());
    } catch (err) { console.error(err.message); }

    const testResult = await TestResult.create({
      userId: req.user._id,
      type: 'aptitude',
      category,
      questions: processedAnswers,
      totalQuestions: answers.length,
      correctAnswers: correct,
      score,
      timeTaken,
      aiAnalysis,
    });

    // Update user aptitude score (rolling average)
    const user = await User.findById(req.user._id);
    user.aptitudeScore = Math.round((user.aptitudeScore + score) / 2);
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, result: testResult, score, correct, total: answers.length });
  } catch (err) { next(err); }
});

// Get test history
router.get('/history', protect, async (req, res, next) => {
  try {
    const results = await TestResult.find({ userId: req.user._id, type: 'aptitude' }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, results });
  } catch (err) { next(err); }
});

module.exports = router;

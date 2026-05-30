// routes/coding.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Question = require('../models/question.model');
const { getAIResponse } = require('../utils/ai');

router.get('/questions', protect, async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const filter = { type: 'coding', isActive: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    const questions = await Question.find(filter).select('-solution -testCases');
    res.json({ success: true, questions });
  } catch (err) { next(err); }
});

router.get('/categories', protect, (req, res) => {
  res.json({
    success: true,
    categories: ['Arrays', 'Strings', 'LinkedList', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Binary Search', 'Recursion', 'Backtracking']
  });
});

router.post('/analyze', protect, async (req, res, next) => {
  try {
    const { code, language, questionTitle, questionDescription } = req.body;
    const prompt = `Analyze this ${language} code solution for: "${questionTitle}":

\`\`\`${language}
${code}
\`\`\`

Return JSON:
{
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "isOptimal": true,
  "feedback": "detailed feedback",
  "optimizationSuggestions": ["suggestion1"],
  "bugs": ["bug if any"],
  "codeQuality": "good|fair|poor",
  "score": 85
}`;
    const aiResp = await getAIResponse(prompt);
    const start = aiResp.indexOf('{');
    const end = aiResp.lastIndexOf('}');
    const analysis = JSON.parse(aiResp.slice(start, end + 1));
    res.json({ success: true, analysis });
  } catch (err) { next(err); }
});

module.exports = router;

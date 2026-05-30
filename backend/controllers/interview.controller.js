const Interview = require('../models/interview.model');
const User = require('../models/user.model');
const { getAIResponse } = require('../utils/ai');

// @desc  Generate interview questions
// @route POST /api/interview/generate
exports.generateInterview = async (req, res, next) => {
  try {
    const { role, type = 'mixed', difficulty = 'medium', questionCount = 10 } = req.body;

    const prompt = `Generate ${questionCount} interview questions for a ${difficulty} level ${role} position.
Type: ${type} (include technical, HR, and behavioral questions if mixed).

Return a JSON array:
[
  {
    "question": "question text",
    "expectedAnswer": "key points to cover in the answer",
    "category": "technical|hr|behavioral",
    "difficulty": "easy|medium|hard"
  }
]

Make questions realistic and commonly asked in Indian campus placements. Return ONLY valid JSON array.`;

    let questions = [];
    try {
      const aiResponse = await getAIResponse(prompt);
      questions = JSON.parse(aiResponse.replace(/```json|```/g, '').trim());
    } catch (err) {
      // Fallback questions
      questions = [
        { question: 'Tell me about yourself.', expectedAnswer: 'Background, skills, goals', category: 'hr', difficulty: 'easy' },
        { question: 'What are your strengths and weaknesses?', expectedAnswer: 'Honest self-assessment', category: 'hr', difficulty: 'easy' },
        { question: 'Explain the difference between Array and LinkedList.', expectedAnswer: 'Memory, access time, insertion/deletion', category: 'technical', difficulty: 'medium' },
        { question: 'Describe a challenging project you worked on.', expectedAnswer: 'STAR method', category: 'behavioral', difficulty: 'medium' },
        { question: 'Where do you see yourself in 5 years?', expectedAnswer: 'Career goals aligned with company', category: 'hr', difficulty: 'easy' },
      ];
    }

    const interview = await Interview.create({
      userId: req.user._id,
      role,
      type,
      difficulty,
      questions,
      status: 'pending',
    });

    res.status(201).json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc  Submit interview answer
// @route POST /api/interview/:id/answer
exports.submitAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answer, timeTaken } = req.body;
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    // AI evaluation
    const evalPrompt = `Evaluate this interview answer:
Question: ${question.question}
Expected Answer Points: ${question.expectedAnswer}
Candidate's Answer: ${answer}

Return JSON: {
  "score": <0-100>,
  "feedback": "<specific feedback>",
  "whatWasGood": "<what was good>",
  "whatToImprove": "<what to improve>"
}`;

    let score = 60, feedback = 'Answer received.';
    try {
      const aiResp = await getAIResponse(evalPrompt);
      const parsed = JSON.parse(aiResp.replace(/```json|```/g, '').trim());
      score = parsed.score || score;
      feedback = parsed.feedback || feedback;
    } catch (err) {
      console.error('Answer eval error:', err.message);
    }

    interview.answers.push({ questionIndex, answer, score, feedback, timeTaken });
    interview.status = 'in-progress';
    await interview.save();

    res.json({ success: true, score, feedback });
  } catch (error) {
    next(error);
  }
};

// @desc  Complete interview & get final evaluation
// @route POST /api/interview/:id/complete
exports.completeInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const avgScore = interview.answers.length > 0
      ? Math.round(interview.answers.reduce((s, a) => s + a.score, 0) / interview.answers.length)
      : 0;

    const summaryPrompt = `Based on ${interview.answers.length} interview answers with average score ${avgScore}/100 for a ${interview.role} role, provide:
Return JSON: {
  "technical": <0-100>,
  "communication": <0-100>,
  "confidence": <0-100>,
  "overall": <0-100>,
  "feedback": "<detailed overall feedback>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<area1>", "<area2>"]
}`;

    let scores = { technical: avgScore, communication: avgScore, confidence: avgScore, overall: avgScore };
    let aiFeedback = 'Interview completed. Review your answers and practice more.';
    let strengths = [], improvements = [];

    try {
      const aiResp = await getAIResponse(summaryPrompt);
      const parsed = JSON.parse(aiResp.replace(/```json|```/g, '').trim());
      scores = { technical: parsed.technical, communication: parsed.communication, confidence: parsed.confidence, overall: parsed.overall };
      aiFeedback = parsed.feedback || aiFeedback;
      strengths = parsed.strengths || [];
      improvements = parsed.improvements || [];
    } catch (err) {
      console.error('Summary error:', err.message);
    }

    interview.scores = scores;
    interview.aiFeedback = aiFeedback;
    interview.strengths = strengths;
    interview.improvements = improvements;
    interview.status = 'completed';
    await interview.save();

    // Update user interview score
    await User.findByIdAndUpdate(req.user._id, { interviewScore: scores.overall });

    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

// @desc  Get user interviews
// @route GET /api/interview
exports.getInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single interview
// @route GET /api/interview/:id
exports.getInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    res.json({ success: true, interview });
  } catch (error) {
    next(error);
  }
};

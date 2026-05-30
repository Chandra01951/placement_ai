const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: {
    type: String,
    enum: ['Software Engineer', 'Data Analyst', 'Data Scientist', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Cloud Engineer'],
    required: true,
  },
  type: { type: String, enum: ['technical', 'hr', 'behavioral', 'mixed'], default: 'mixed' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },

  questions: [{
    question: { type: String },
    expectedAnswer: { type: String },
    category: { type: String },
    difficulty: { type: String },
  }],

  answers: [{
    questionIndex: { type: Number },
    answer: { type: String },
    score: { type: Number },
    feedback: { type: String },
    timeTaken: { type: Number }, // seconds
  }],

  scores: {
    technical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
  },

  duration: { type: Number }, // minutes
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  aiFeedback: { type: String },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);

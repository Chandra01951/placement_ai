const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['aptitude', 'coding'], required: true },
  category: { type: String },
  
  questions: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: { type: String },
    isCorrect: { type: Boolean },
    timeTaken: { type: Number },
  }],

  totalQuestions: { type: Number },
  correctAnswers: { type: Number },
  score: { type: Number }, // percentage
  timeTaken: { type: Number }, // seconds
  
  aiAnalysis: {
    weakAreas: [{ type: String }],
    strongAreas: [{ type: String }],
    suggestions: [{ type: String }],
  },
}, { timestamps: true });

module.exports = mongoose.model('TestResult', testResultSchema);

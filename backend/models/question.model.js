const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['aptitude', 'coding', 'interview'], required: true },
  category: { type: String, required: true }, // quantitative, logical, verbal, arrays, trees, etc.
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  
  // For aptitude (MCQ)
  options: [{ type: String }],
  correctAnswer: { type: String },
  explanation: { type: String },

  // For coding
  examples: [{
    input: { type: String },
    output: { type: String },
    explanation: { type: String },
  }],
  testCases: [{
    input: { type: String },
    expectedOutput: { type: String },
    isHidden: { type: Boolean, default: false },
  }],
  starterCode: {
    javascript: { type: String },
    python: { type: String },
    java: { type: String },
    cpp: { type: String },
  },
  solution: { type: String },
  timeLimit: { type: Number, default: 1000 }, // ms
  memoryLimit: { type: Number, default: 256 }, // MB
  tags: [{ type: String }],
  companies: [{ type: String }],
  solvedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);

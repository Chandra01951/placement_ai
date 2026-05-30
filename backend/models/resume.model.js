const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  cloudinaryId: { type: String },
  fileType: { type: String, enum: ['pdf', 'docx', 'doc'] },

  // Extracted Data
  extractedText: { type: String },
  extractedSkills: [{ type: String }],
  extractedEducation: [{ type: mongoose.Schema.Types.Mixed }],
  extractedExperience: [{ type: mongoose.Schema.Types.Mixed }],
  extractedProjects: [{ type: mongoose.Schema.Types.Mixed }],

  // AI Analysis
  atsScore: { type: Number, default: 0 },
  resumeScore: { type: Number, default: 0 },
  grammarScore: { type: Number, default: 0 },
  formattingScore: { type: Number, default: 0 },

  aiFeedback: {
    summary: { type: String },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
    grammarIssues: [{ type: String }],
    formattingIssues: [{ type: String }],
  },

  improvedSummary: { type: String },
  improvedSkillsSection: { type: String },
  improvedProjects: [{ type: String }],

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);

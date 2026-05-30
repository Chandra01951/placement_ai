const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String },
  website: { type: String },
  description: { type: String },
  industry: { type: String },
  founded: { type: Number },
  headquarters: { type: String },
  employeeCount: { type: String },

  hiringProcess: [{
    step: { type: Number },
    title: { type: String },
    description: { type: String },
    duration: { type: String },
  }],

  interviewRounds: [{
    round: { type: String },
    description: { type: String },
    tips: [{ type: String }],
  }],

  previousQuestions: [{
    question: { type: String },
    category: { type: String },
    year: { type: Number },
  }],

  interviewExperiences: [{
    year: { type: Number },
    role: { type: String },
    experience: { type: String },
    difficulty: { type: String },
    selected: { type: Boolean },
  }],

  preparationRoadmap: [{
    week: { type: Number },
    topics: [{ type: String }],
    resources: [{ type: String }],
  }],

  requiredSkills: [{ type: String }],
  preferredSkills: [{ type: String }],
  averagePackage: { type: String },
  roles: [{ type: String }],

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);

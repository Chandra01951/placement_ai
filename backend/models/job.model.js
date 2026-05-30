const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: { type: String },
  location: { type: String, required: true },
  type: { type: String, enum: ['internship', 'full-time', 'part-time', 'contract'], default: 'full-time' },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' },
  },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  skills: [{ type: String }],
  experience: { type: String },
  education: { type: String },
  applicationDeadline: { type: Date },
  applicationUrl: { type: String },
  applicationCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);

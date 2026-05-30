const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },

  // Academic
  college: { type: String, default: '' },
  degree: { type: String, default: '' },
  branch: { type: String, default: '' },
  cgpa: { type: Number, min: 0, max: 10 },
  graduationYear: { type: Number },

  // Skills
  technicalSkills: [{ type: String }],
  softSkills: [{ type: String }],

  // Social
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },

  // Auth
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  googleId: { type: String },
  refreshToken: { type: String },

  // Scores
  resumeScore: { type: Number, default: 0 },
  aptitudeScore: { type: Number, default: 0 },
  codingScore: { type: Number, default: 0 },
  interviewScore: { type: Number, default: 0 },
  placementReadiness: { type: Number, default: 0 },

  // Streak
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  badges: [{ type: String }],

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate placement readiness
userSchema.methods.calculateReadiness = function () {
  const weights = { resume: 0.25, aptitude: 0.25, coding: 0.3, interview: 0.2 };
  const score =
    (this.resumeScore * weights.resume) +
    (this.aptitudeScore * weights.aptitude) +
    (this.codingScore * weights.coding) +
    (this.interviewScore * weights.interview);
  this.placementReadiness = Math.round(score);
  return this.placementReadiness;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.resetPasswordToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

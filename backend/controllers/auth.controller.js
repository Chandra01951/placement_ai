const User = require('../models/user.model');
const { generateTokens } = require('../middleware/auth.middleware');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// @desc  Register user
// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, college, branch, cgpa, graduationYear } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({
      name, email, password, college, branch, cgpa, graduationYear,
      emailVerificationToken: verificationToken,
    });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Welcome to PlacementAI – Verify your email',
      html: `<h2>Hi ${name}!</h2><p>Please verify your email: <a href="${verifyUrl}">Verify Email</a></p>`,
    }).catch(console.error);

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Registered successfully! Please verify your email.',
      token: accessToken,
      refreshToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;

    // Update streak
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      user.streak = lastActive === yesterday ? user.streak + 1 : 1;
      user.lastActiveDate = new Date();
    }
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      refreshToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Refresh token
// @route POST /api/auth/refresh
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, token: accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
};

// @desc  Verify email
// @route GET /api/auth/verify-email/:token
exports.verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ emailVerificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc  Forgot password
// @route POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account with that email' });
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'PlacementAI – Password Reset',
      html: `<p>Reset your password: <a href="${resetUrl}">Reset Password</a> (valid for 10 minutes)</p>`,
    });
    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

// @desc  Reset password
// @route POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// @desc  Get current user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc  Logout
// @route POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

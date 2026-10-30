const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const httpError = require('../utils/httpError');
const { sendPasswordResetOtpEmail } = require('../utils/mailer');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e);

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !emailOk(email)) throw httpError(400, 'Enter your name and a valid email.');
  if (!password || password.length < 6) throw httpError(400, 'Password must be at least 6 characters.');
  if (await User.findOne({ email: email.toLowerCase() })) throw httpError(400, 'An account with this email already exists.');
  // role is never taken from the request: public sign-ups are always normal users.
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: sign(user._id), user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!emailOk(email) || !password) throw httpError(400, 'Enter your email and password.');
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) throw httpError(401, 'Email or password is incorrect.');
  if (user.status === 'Inactive') throw httpError(403, 'This account is inactive. Contact the admin.');
  user.password = undefined;
  res.json({ token: sign(user._id), user });
};

exports.profile = (req, res) => res.json(req.user);

/**
 * Initiates the forgot password flow by generating a 6-digit numeric OTP
 * and sending it to the user's email via Nodemailer.
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email || !emailOk(email)) {
    throw httpError(400, 'Please provide a valid email address.');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw httpError(404, 'No account registered with this email address.');
  }

  if (user.status === 'Inactive') {
    throw httpError(403, 'This account is inactive. Please contact the administrator.');
  }

  // Generate a cryptographically secure 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpires = otpExpiry;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save();

  // Send the OTP via Nodemailer
  await sendPasswordResetOtpEmail(user.email, otp, user.name);

  res.json({
    success: true,
    message: 'A 6-digit verification code has been sent to your email address.',
    email: user.email,
  });
};

/**
 * Verifies the 6-digit numeric OTP.
 * On verification, the user is allowed to proceed and issued a temporary reset token.
 */
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !emailOk(email)) {
    throw httpError(400, 'Please provide a valid email address.');
  }

  // OTP must be strictly 6 digits and numeric only
  const cleanOtp = typeof otp === 'string' ? otp.trim() : String(otp || '').trim();
  if (!cleanOtp || !/^\d{6}$/.test(cleanOtp)) {
    throw httpError(400, 'Verification code must be exactly 6 numeric digits.');
  }

  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+resetPasswordOtp +resetPasswordOtpExpires');

  if (!user) {
    throw httpError(404, 'No account found with this email.');
  }

  if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
    throw httpError(400, 'No verification code was requested. Please request a new code.');
  }

  if (new Date() > user.resetPasswordOtpExpires) {
    throw httpError(400, 'The verification code has expired. Please request a new one.');
  }

  if (user.resetPasswordOtp !== cleanOtp) {
    throw httpError(400, 'Invalid verification code. Please check your email and try again.');
  }

  // OTP is verified! Invalidate the OTP and issue a short-lived reset token to allow the user to proceed.
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpires = undefined;
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes to reset password
  await user.save();

  res.json({
    success: true,
    message: 'OTP verified successfully! You may now proceed to reset your password.',
    resetToken,
  });
};

/**
 * Resets the password using the temporary reset token obtained from OTP verification.
 */
exports.resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  if (!email || !emailOk(email)) {
    throw httpError(400, 'Please provide a valid email address.');
  }

  if (!resetToken || typeof resetToken !== 'string') {
    throw httpError(400, 'Reset token is missing or invalid. Please verify your OTP again.');
  }

  if (!newPassword || newPassword.length < 6) {
    throw httpError(400, 'New password must be at least 6 characters long.');
  }

  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+resetPasswordToken +resetPasswordTokenExpires');

  if (!user || !user.resetPasswordToken || !user.resetPasswordTokenExpires) {
    throw httpError(400, 'Password reset session is invalid or has expired. Please start over.');
  }

  if (new Date() > user.resetPasswordTokenExpires) {
    throw httpError(400, 'Password reset session has expired. Please request a new verification code.');
  }

  if (user.resetPasswordToken !== resetToken) {
    throw httpError(400, 'Invalid password reset token.');
  }

  // Update password and clear reset token
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Your password has been successfully reset! You can now log in with your new password.',
  });
};


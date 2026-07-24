import authRepository from '../../repositories/auth/auth.repository.js';
import { USER_ROLES } from '../../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.util.js';
import { generateOtp, sendOtpEmail } from '../../utils/email.util.js';

class AuthService {
  /**
   * Signup Flow
   */
  async signup(userData) {
    const { name, email, phone, password, preferredLanguage } = userData;

    // Check duplicate email
    const existingEmail = await authRepository.findByEmail(email);
    if (existingEmail) {
      const error = new Error('Email address is already registered');
      error.statusCode = 400;
      throw error;
    }

    // Check duplicate phone
    const existingPhone = await authRepository.findByPhone(phone);
    if (existingPhone) {
      const error = new Error('Phone number is already registered');
      error.statusCode = 400;
      throw error;
    }

    // Generate 6-digit OTP (10 minutes expiry)
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save temporary unverified user with FARMER role only
    const newUser = await authRepository.createUser({
      name,
      email,
      phone,
      password,
      preferredLanguage: preferredLanguage || 'English',
      role: USER_ROLES.FARMER,
      emailVerified: false,
      otp,
      otpExpiry,
    });

    // Send OTP email
    await sendOtpEmail(email, otp, 'Email Verification Code');

    return {
      userId: newUser._id,
      email: newUser.email,
      message: 'Signup successful. Please verify the OTP sent to your email.',
    };
  }

  /**
   * Verify OTP Flow
   */
  async verifyOtp(email, otp) {
    const user = await authRepository.findByEmail(email, false, true);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.emailVerified && !user.otp) {
      return { message: 'Email is already verified. Please log in.' };
    }

    if (!user.otp || user.otp !== otp) {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > user.otpExpiry) {
      const error = new Error('OTP has expired. Please request a new one.');
      error.statusCode = 400;
      throw error;
    }

    await authRepository.clearOtpAndVerifyEmail(user._id);

    return { message: 'Email verified successfully. You can now log in.' };
  }

  /**
   * Login Flow
   */
  async login(email, password) {
    const user = await authRepository.findByEmail(email, true);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!user.emailVerified) {
      const error = new Error('Email is not verified. Please verify your email before logging in.');
      error.statusCode = 403;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Account is deactivated. Please contact support.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const payload = { id: user._id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await authRepository.updateRefreshToken(user._id, refreshToken);
    await authRepository.updateLastLogin(user._id);

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.otp;
    delete userObject.refreshToken;

    return {
      accessToken,
      refreshToken,
      user: userObject,
    };
  }

  /**
   * Refresh Token Flow
   */
  async refreshToken(token) {
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    const user = await authRepository.findById(decoded.id, true);
    if (!user || user.refreshToken !== token) {
      const error = new Error('Refresh token is no longer valid');
      error.statusCode = 401;
      throw error;
    }

    const payload = { id: user._id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(payload);

    return { accessToken };
  }

  /**
   * Logout Flow
   */
  async logout(userId) {
    await authRepository.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  /**
   * Forgot Password Flow
   */
  async forgotPassword(email) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      const error = new Error('User with this email address does not exist');
      error.statusCode = 404;
      throw error;
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await authRepository.updateOtp(user._id, otp, otpExpiry);
    await sendOtpEmail(email, otp, 'Password Reset Code');

    return { message: 'Password reset OTP has been sent to your email.' };
  }

  /**
   * Reset Password Flow
   */
  async resetPassword(email, otp, newPassword) {
    const user = await authRepository.findByEmail(email, false, true);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (!user.otp || user.otp !== otp) {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > user.otpExpiry) {
      const error = new Error('OTP has expired. Please request a new one.');
      error.statusCode = 400;
      throw error;
    }

    await authRepository.updatePassword(user._id, newPassword);

    return { message: 'Password reset successful. You can now log in with your new password.' };
  }

  /**
   * Get Profile Flow
   */
  async getProfile(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      const error = new Error('User profile not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Update Profile Flow
   */
  async updateProfile(userId, updateData) {
    if (updateData.phone) {
      const existingPhone = await authRepository.findByPhone(updateData.phone);
      if (existingPhone && existingPhone._id.toString() !== userId.toString()) {
        const error = new Error('Phone number is already in use by another account');
        error.statusCode = 400;
        throw error;
      }
    }

    const updatedUser = await authRepository.updateProfile(userId, updateData);
    return updatedUser;
  }
}

export default new AuthService();

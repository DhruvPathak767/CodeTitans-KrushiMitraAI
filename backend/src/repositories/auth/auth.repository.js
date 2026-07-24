import User from '../../models/User.js';

class AuthRepository {
  async findByEmail(email, selectPassword = false, selectOtp = false, selectRefreshToken = false) {
    let query = User.findOne({ email });
    if (selectPassword || selectOtp || selectRefreshToken) {
      const selectFields = [];
      if (selectPassword) selectFields.push('+password');
      if (selectOtp) selectFields.push('+otp');
      if (selectRefreshToken) selectFields.push('+refreshToken');
      query = query.select(selectFields.join(' '));
    }
    return await query.exec();
  }

  async findByPhone(phone) {
    return await User.findOne({ phone });
  }

  async findById(id, selectRefreshToken = false) {
    let query = User.findById(id);
    if (selectRefreshToken) {
      query = query.select('+refreshToken');
    }
    return await query.exec();
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateOtp(userId, otp, otpExpiry) {
    return await User.findByIdAndUpdate(
      userId,
      { otp, otpExpiry },
      { returnDocument: 'after' }
    );
  }

  async clearOtpAndVerifyEmail(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        emailVerified: true,
        $unset: { otp: 1, otpExpiry: 1 },
      },
      { returnDocument: 'after' }
    );
  }

  async clearOtp(userId) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $unset: { otp: 1, otpExpiry: 1 },
      },
      { returnDocument: 'after' }
    );
  }

  async updateRefreshToken(userId, refreshToken) {
    return await User.findByIdAndUpdate(
      userId,
      { refreshToken },
      { returnDocument: 'after' }
    );
  }

  async updateLastLogin(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { returnDocument: 'after' }
    );
  }

  async updatePassword(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) return null;
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    return await user.save();
  }

  async updateProfile(userId, profileData) {
    // Exclude role, email, password from direct profile update
    const { role, email, password, isVerified, emailVerified, ...allowedUpdates } = profileData;
    return await User.findByIdAndUpdate(userId, allowedUpdates, { returnDocument: 'after' });
  }
}

export default new AuthRepository();

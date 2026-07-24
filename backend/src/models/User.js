import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * User Roles Enum
 */
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  FARMER: 'FARMER',
};

/**
 * Supported Languages Enum
 */
export const LANGUAGES = {
  ENGLISH: 'English',
  HINDI: 'Hindi',
  GUJARATI: 'Gujarati',
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.FARMER,
    },
    preferredLanguage: {
      type: String,
      enum: Object.values(LANGUAGES),
      default: LANGUAGES.ENGLISH,
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'gu'],
      default: 'en',
    },
    profileImage: {
      type: String,
      trim: true,
      default: '',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    activeFarm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

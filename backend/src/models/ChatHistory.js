import mongoose from 'mongoose';
import { LANGUAGES } from './User.js';

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    language: {
      type: String,
      enum: Object.values(LANGUAGES),
      default: LANGUAGES.ENGLISH,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
chatHistorySchema.index({ userId: 1, createdAt: -1 });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
export default ChatHistory;

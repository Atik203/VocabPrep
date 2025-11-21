import mongoose, { Document, Schema } from "mongoose";

export interface IAIUsage extends Document {
  userId: mongoose.Types.ObjectId;
  endpoint: string;
  requestTimestamp: Date;
  tokensUsed: number;
  responseTime: number; // milliseconds
  success: boolean;
  errorMessage?: string;

  // Request context
  vocabularyId?: mongoose.Types.ObjectId;
  practiceId?: mongoose.Types.ObjectId;

  createdAt: Date;
}

const aiUsageSchema = new Schema<IAIUsage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    endpoint: {
      type: String,
      required: true,
      enum: [
        "/ai/enhance-vocab",
        "/ai/practice-feedback",
        "/ai/suggestions",
        "/ai/quiz-generation",
      ],
    },
    requestTimestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    tokensUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
      default: true,
    },
    errorMessage: {
      type: String,
    },
    vocabularyId: {
      type: Schema.Types.ObjectId,
      ref: "Vocabulary",
    },
    practiceId: {
      type: Schema.Types.ObjectId,
      ref: "PracticeEntry",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for efficient user queries
aiUsageSchema.index({ userId: 1, requestTimestamp: -1 });

// TTL index - auto-delete records after 90 days (data retention policy)
aiUsageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

export const AIUsageModel = mongoose.model<IAIUsage>("AIUsage", aiUsageSchema);

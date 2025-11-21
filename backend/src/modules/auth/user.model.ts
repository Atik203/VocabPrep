import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  
  // AI & Subscription fields
  subscriptionTier: 'free' | 'premium';
  aiRequestsRemaining: number;
  aiResetDate: Date;
  isAdmin: boolean;
  stripeCustomerId?: string;
  subscriptionExpiresAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values for non-Google users
    },
    avatar: {
      type: String,
    },
    
    // AI & Subscription fields
    subscriptionTier: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    aiRequestsRemaining: {
      type: Number,
      default: 100, // Free tier daily limit
    },
    aiResetDate: {
      type: Date,
      default: () => {
        const tomorrow = new Date();
        tomorrow.setUTCHours(24, 0, 0, 0);
        return tomorrow;
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: {
      type: String,
    },
    subscriptionExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model<IUser>("User", userSchema);

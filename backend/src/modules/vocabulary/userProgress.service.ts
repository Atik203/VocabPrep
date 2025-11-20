import { HttpError } from "../../utils/httpError";
import {
  UserProgressModel,
  type UserLearningStatus,
  type UserProgressDocument,
} from "./userProgress.model";

export const getUserProgress = async (
  userId: string,
  vocabularyId: string
): Promise<UserProgressDocument | null> => {
  return UserProgressModel.findOne({
    userId,
    vocabularyId,
  }).lean();
};

export const updateUserProgress = async (
  userId: string,
  vocabularyId: string,
  status: UserLearningStatus
): Promise<UserProgressDocument> => {
  const progress = await UserProgressModel.findOneAndUpdate(
    { userId, vocabularyId },
    {
      status,
      lastReviewedAt: new Date(),
      $inc: { reviewCount: 1 },
    },
    { new: true, upsert: true, runValidators: true }
  );

  if (!progress) {
    throw new HttpError(500, "Failed to update progress");
  }

  return progress;
};

export const getUserProgressList = async (
  userId: string,
  status?: UserLearningStatus
): Promise<UserProgressDocument[]> => {
  const query: any = { userId };
  if (status) {
    query.status = status;
  }

  return UserProgressModel.find(query).sort({ updatedAt: -1 }).lean();
};

export const deleteUserProgress = async (
  userId: string,
  vocabularyId: string
): Promise<void> => {
  await UserProgressModel.findOneAndDelete({ userId, vocabularyId });
};

export const getUserProgressStats = async (
  userId: string
): Promise<{
  total: number;
  new: number;
  learning: number;
  learned: number;
}> => {
  const stats = await UserProgressModel.aggregate([
    { $match: { userId: userId as any } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    new: 0,
    learning: 0,
    learned: 0,
  };

  stats.forEach((stat) => {
    const status = stat._id as UserLearningStatus;
    result[status] = stat.count;
    result.total += stat.count;
  });

  return result;
};

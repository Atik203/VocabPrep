import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
} from "./auth.service";
import { registerSchema, loginSchema, updateUserSchema } from "./auth.schema";

// Register
export const registerHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const result = await registerUser(data);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

// Login
export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const result = await loginUser(data);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

// Get current user
export const getMeHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await getUserById(req.userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// Update user
export const updateUserHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const data = updateUserSchema.parse(req.body);
  const user = await updateUser(req.userId, data);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: { user },
  });
});

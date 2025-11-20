import { Router } from "express";
import passport from "passport";
import {
  registerHandler,
  loginHandler,
  getMeHandler,
  updateUserHandler,
} from "./auth.controller";
import { authenticate } from "../../middlewares/authenticate";

const router = Router();

// Register
router.post("/register", registerHandler);

// Login
router.post("/login", loginHandler);

// Google OAuth - Initiate
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google OAuth - Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=oauth_failed",
  }),
  (req, res) => {
    // Success - send token to frontend
    const result = req.user as unknown as { user: any; token: string };
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/auth/callback?token=${result.token}`);
  }
);

// Get current user (protected)
router.get("/me", authenticate, getMeHandler);

// Update user (protected)
router.patch("/me", authenticate, updateUserHandler);

export default router;

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "./auth.service";
import { UserModel } from "./auth.model";

// Configure Google OAuth Strategy
export const configureGoogleAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const result = await findOrCreateGoogleUser(profile);
          done(null, result);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );

  // Serialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.user._id);
  });

  // Deserialize user
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

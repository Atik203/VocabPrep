# Authentication Setup Guide

## Overview

Complete authentication system with email/password login, registration, and Google OAuth integration.

## Features

- ✅ Email/Password Registration & Login
- ✅ Google OAuth Integration
- ✅ JWT-based Authentication
- ✅ Protected Routes
- ✅ User Profile Management
- ✅ Persistent Sessions
- ✅ User Dropdown with Avatar
- ✅ Responsive Login/Register Pages

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
yarn add passport passport-google-oauth20 express-session bcryptjs jsonwebtoken
yarn add -D @types/passport @types/passport-google-oauth20 @types/express-session @types/bcryptjs @types/jsonwebtoken
```

### 2. Environment Variables

Create or update `backend/.env`:

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=your-mongodb-connection-string
DB_NAME=EnglishPrep
API_BASE_PATH=/api/v1

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/v1/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:4000/api/v1/auth/google/callback`
   - For production: `https://yourdomain.com/api/v1/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
yarn add next-auth@beta bcryptjs jsonwebtoken
yarn add -D @types/bcryptjs @types/jsonwebtoken
```

### 2. Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/google` - Initiate Google OAuth
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `GET /api/v1/auth/me` - Get current user (protected)
- `PATCH /api/v1/auth/me` - Update user (protected)

### Request/Response Examples

#### Register

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response: Same as register

#### Get Current User

```bash
GET /api/v1/auth/me
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

## Frontend Pages

### Login Page

- Route: `/login`
- Features:
  - Email/Password form
  - Google OAuth button
  - Link to register page
  - Liquid glass design

### Register Page

- Route: `/register`
- Features:
  - Name, Email, Password, Confirm Password fields
  - Google OAuth button
  - Link to login page
  - Client-side validation

### OAuth Callback Page

- Route: `/auth/callback`
- Handles Google OAuth redirect
- Fetches user data and stores token
- Redirects to home page

## Frontend Components

### UserDropdown

- Shows user avatar (or initials)
- Dropdown menu with:
  - User name and email
  - Add Words link
  - Progress link
  - Profile link
  - Logout button

### AuthProvider

- Checks for stored token on mount
- Fetches user data if token exists
- Updates Redux state with user info

### Protected Routes (Future)

```tsx
// Example protected route component
"use client";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
```

## Redux Store Structure

### Auth State

```typescript
{
  auth: {
    user: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
      googleId?: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
  }
}
```

### Auth API Slice

- `useRegisterMutation()` - Register new user
- `useLoginMutation()` - Login user
- `useGetMeQuery()` - Get current user
- `useUpdateUserMutation()` - Update user profile

### Auth Actions

- `setCredentials({ user, token })` - Set user and token
- `logout()` - Clear user and token

## Security Features

### Backend

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token with 7-day expiration
- ✅ Password field excluded from queries by default
- ✅ Unique email and googleId indexes
- ✅ Session management with express-session
- ✅ CORS configured for frontend URL
- ✅ Helmet for security headers

### Frontend

- ✅ Token stored in localStorage
- ✅ Token sent in Authorization header
- ✅ Password confirmation validation
- ✅ Minimum password length (6 characters)
- ✅ Type-safe API with TypeScript

## Testing

### Backend (with curl)

```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get Me
curl http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer <your-token>"
```

### Frontend

1. Open http://localhost:3000
2. Click "Login" in navbar
3. Try registering a new account
4. Try logging in with Google
5. Check user dropdown appears after login
6. Verify logout works

## Troubleshooting

### Google OAuth Not Working

- Verify Google Client ID and Secret in `.env`
- Check authorized redirect URIs in Google Console
- Make sure both frontend and backend are running
- Check browser console for errors

### Token Not Persisting

- Check localStorage in browser DevTools
- Verify CORS settings in backend
- Check API_URL in frontend `.env.local`

### User Not Showing in Dropdown

- Open Redux DevTools and check auth state
- Check Network tab for `/auth/me` request
- Verify token is being sent in headers

## Next Steps

### Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] User profile page with avatar upload
- [ ] Progress tracking dashboard
- [ ] Link vocabulary to user accounts
- [ ] Social login with GitHub/Facebook
- [ ] Remember me functionality
- [ ] Session timeout warnings

## File Structure

```
backend/
  src/
    modules/
      auth/
        auth.model.ts          # User Mongoose schema
        auth.service.ts        # Auth business logic
        auth.controller.ts     # Request handlers
        auth.routes.ts         # Express routes
        auth.passport.ts       # Passport Google strategy
        auth.schema.ts         # Zod validation schemas
        user.model.ts          # Duplicate model (can be removed)

frontend/
  src/
    app/
      login/page.tsx          # Login page
      register/page.tsx       # Register page
      auth/callback/page.tsx  # OAuth callback
    components/
      layout/
        user-dropdown.tsx     # User dropdown menu
      providers/
        auth-provider.tsx     # Auth context provider
    redux/
      features/
        auth/
          authApi.ts          # RTK Query auth API
          authSlice.ts        # Auth state slice
```

## Notes

- Backend uses JWT for stateless authentication
- Frontend uses Redux for state management
- Google OAuth requires HTTPS in production
- Token expires after 7 days (configurable)
- Session cookie expires after 24 hours

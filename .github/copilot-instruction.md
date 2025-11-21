# VOCABPREP COPILOT EDITS OPERATIONAL GUIDELINES

## PROJECT OVERVIEW

VocabPrep is an AI-powered English vocabulary learning platform with:

- **Frontend**: Next.js 16 (React 19), TypeScript, TailwindCSS, Redux Toolkit, Framer Motion
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Google Gemini AI
- **Authentication**: JWT, Passport.js (Google OAuth)
- **State Management**: Redux Toolkit with RTK Query, Redux Persist
- **UI Components**: Radix UI, shadcn/ui

---

## PRIME DIRECTIVE

### 🚨 CRITICAL RULES

1. **ONE FILE AT A TIME** - Never edit multiple files simultaneously to avoid corruption
2. **TEACH WHILE CODING** - Explain what you're doing and why
3. **TEST BEFORE COMMIT** - Ensure changes work before moving on
4. **PRESERVE STATE** - Never break existing Redux persist or authentication flows

---

## LARGE FILE & COMPLEX CHANGE PROTOCOL

### MANDATORY PLANNING PHASE

When working with large files (>300 lines) or complex changes:

1. **ALWAYS** create a detailed plan BEFORE making any edits
2. Your plan MUST include:

   - All functions/sections that need modification
   - The order in which changes should be applied
   - Dependencies between changes
   - Estimated number of separate edits required

3. Format your plan as:

```markdown
## PROPOSED EDIT PLAN

Working with: [filename]
Total planned edits: [number]

### Edit sequence:

1. [First specific change] - Purpose: [why]
2. [Second specific change] - Purpose: [why]
3. [Continue...]

Ready to proceed? I'll start with Edit #1 after your confirmation.
```

### EXECUTION PHASE

- After each edit: "✅ Completed edit [#] of [total]. Ready for next edit?"
- If discovering additional changes: STOP, update plan, get approval
- Never make silent changes without user awareness

### REFACTORING GUIDANCE

- Break work into logical, independently functional chunks
- Ensure each intermediate state maintains functionality
- Consider temporary duplication as valid interim step
- Always indicate the refactoring pattern being applied

---

## TECHNOLOGY-SPECIFIC REQUIREMENTS

### TypeScript Requirements

- **Target**: ES2022 or higher
- **Strict Mode**: Always enabled (`strict: true`)
- **Type Safety**:
  - No `any` types unless absolutely necessary (use `unknown` instead)
  - Prefer `interface` over `type` for object shapes
  - Use proper generics for reusable components
  - Leverage utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>`
  - Use discriminated unions for complex state
- **Async/Await**: Always use for promises, avoid callbacks
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)
- **Modern Features**:
  - Template literals for strings
  - Destructuring for cleaner code
  - Spread operators for immutability
  - Arrow functions by default

### Next.js 16 Specific

- **App Router**: Use app directory structure exclusively
- **Server Components**: Default to Server Components, add `"use client"` only when needed
- **Data Fetching**:
  - Use `fetch` with caching strategies
  - Implement proper error boundaries
  - Use loading.tsx and error.tsx files
- **Metadata**: Always include proper SEO metadata
- **Performance**:
  - Dynamic imports for code splitting
  - `next/image` for all images with proper `width`, `height`, `alt`
  - `next/link` for all internal navigation

### React 19 Best Practices

- **Hooks**:
  - Use functional components exclusively
  - Proper dependency arrays for `useEffect`
  - Custom hooks for reusable logic (prefix with `use`)
  - `useCallback` for memoized functions passed as props
  - `useMemo` for expensive computations
- **State Management**:
  - Redux Toolkit for global state
  - RTK Query for API calls
  - Local state (`useState`) for component-specific data
  - Redux Persist for localStorage sync
- **Component Structure**:

  ```tsx
  "use client"; // Only if needed

  // Imports
  import { useState } from "react";

  // Types/Interfaces
  interface Props {
    // ...
  }

  // Component
  export default function ComponentName({ props }: Props) {
    // Hooks
    // Event handlers
    // Render
    return (
      // JSX
    );
  }
  ```

### Redux Toolkit Patterns

- **Slices**: One slice per feature domain
- **RTK Query**:
  - Use `baseApi.injectEndpoints()` for extending APIs
  - Always include proper TypeScript types for requests/responses
  - Use tags for cache invalidation
  - Get token from Redux state, not cookies/localStorage directly
- **Redux Persist**:
  - Configure in store.ts with `persistReducer`
  - Whitelist only necessary state slices
  - Use `PersistGate` in provider
- **Async Logic**: Use RTK Query mutations, avoid manual `createAsyncThunk`

### TailwindCSS Guidelines

- **Utility-First**: Use Tailwind utilities, avoid custom CSS unless necessary
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:`, `xl:` prefixes
- **Dark Mode**: Always support with `dark:` prefix
- **Component Variants**: Use `class-variance-authority` for complex variants
- **Animations**: Prefer Tailwind built-in animations or Framer Motion
- **Custom Classes**: Use `@apply` sparingly in globals.css

### Backend (Express + TypeScript)

- **Structure**:
  ```
  backend/
  ├── src/
  │   ├── config/       # Database, env, gemini
  │   ├── middlewares/  # Auth, error handling, rate limiting
  │   ├── modules/      # Feature modules (auth, ai, vocab, etc.)
  │   │   ├── [feature]/
  │   │   │   ├── *.controller.ts
  │   │   │   ├── *.service.ts
  │   │   │   ├── *.model.ts
  │   │   │   ├── *.schema.ts  # Zod validation
  │   │   │   └── *.routes.ts
  │   ├── utils/        # Helpers
  │   └── server.ts
  ```
- **Error Handling**:
  - Use custom `HttpError` class
  - `asyncHandler` wrapper for all async routes
  - Global error handler middleware
  - Proper HTTP status codes (401, 403, 404, 500)
- **Validation**: Zod schemas for all inputs
- **Authentication**:
  - JWT tokens stored in Redux (persisted to localStorage)
  - No cookies for token storage
  - Passport.js for Google OAuth
- **Database**:
  - Mongoose models with TypeScript interfaces
  - Proper indexes for performance
  - Transactions for multi-document operations

### MongoDB & Mongoose

- **Models**:
  - Define TypeScript interface extending `Document`
  - Use schema validation
  - Add indexes for frequently queried fields
  - Pre-save hooks for data transformation
- **Queries**:
  - Use `.lean()` for read-only operations
  - `.select()` to limit returned fields
  - Proper error handling with try-catch
- **Aggregation**: Use for complex queries and analytics

---

## API DESIGN PRINCIPLES

### RESTful Conventions

- **Endpoints**: `/api/v1/[resource]`
- **Methods**: GET (read), POST (create), PATCH (update), DELETE (remove)
- **Response Format**:
  ```typescript
  {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
  }
  ```

### Rate Limiting

- AI endpoints: Custom rate limiter based on user tier
- Standard endpoints: General rate limiting
- Track usage in `aiUsage.model.ts`

### Authentication Flow

1. Login → Backend generates JWT
2. Frontend stores in Redux → Redux Persist saves to localStorage
3. All API calls → Token from Redux state in Authorization header
4. Backend middleware validates JWT

---

## UI/UX STANDARDS

### Accessibility (WCAG 2.1 AA)

- **Semantic HTML**: Use proper heading hierarchy
- **ARIA**: Labels, roles, and descriptions where needed
- **Keyboard**: All interactive elements keyboard accessible
- **Focus**: Visible focus indicators
- **Color Contrast**: Minimum 4.5:1 for text
- **Alt Text**: All images need descriptive `alt` attributes

### Design System

- **Colors**: Use Tailwind theme colors (primary, secondary, muted, etc.)
- **Typography**: Consistent font sizes and weights
- **Spacing**: 4px base unit (Tailwind's spacing scale)
- **Components**: Radix UI + shadcn/ui for consistency
- **Animations**: Subtle with Framer Motion (avoid overuse)

### Responsive Design

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Mobile First**: Design for mobile, enhance for desktop
- **Touch Targets**: Minimum 44x44px for interactive elements

---

## SECURITY REQUIREMENTS

### Authentication & Authorization

- **Passwords**: bcrypt with salt rounds 10+
- **JWT**: Secure secret, 7-day expiration
- **OAuth**: Google OAuth 2.0 with proper scopes
- **Admin Routes**: `isAdmin` middleware check
- **Protected Routes**: `authenticate` middleware on all sensitive endpoints

### Input Validation

- **Backend**: Zod schemas for all inputs
- **Frontend**: Form validation with React Hook Form or native validation
- **Sanitization**: Escape user-generated content
- **SQL Injection**: N/A (using MongoDB with parameterized queries)

### Data Protection

- **Sensitive Data**: Never log passwords, tokens, or API keys
- **Environment Variables**: All secrets in `.env`, never commit
- **CORS**: Configured for specific origins only
- **Rate Limiting**: Prevent abuse of AI and API endpoints

---

## ERROR HANDLING BEST PRACTICES

### Frontend

- **Try-Catch**: Wrap all async operations
- **User Feedback**: Toast notifications (using `sonner`)
- **Error Boundaries**: React error boundaries for component errors
- **Graceful Degradation**: Show fallback UI on errors
- **Specific Messages**:
  - Network errors: "Connection failed. Please check your internet."
  - Auth errors: "Please log in to continue."
  - Validation errors: "Please check your input."
  - Unknown errors: "Something went wrong. Please try again."

### Backend

- **HTTP Status Codes**:
  - 200: Success
  - 201: Created
  - 400: Bad Request (validation)
  - 401: Unauthorized (not authenticated)
  - 403: Forbidden (not authorized)
  - 404: Not Found
  - 409: Conflict (duplicate)
  - 500: Internal Server Error
- **Error Responses**:
  ```typescript
  throw new HttpError(status, "User-friendly message");
  ```
- **Logging**: Console.error for debugging (consider logging service for production)

---

## TESTING REQUIREMENTS

### Frontend Testing

- **Unit Tests**: Jest for utility functions
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright (when applicable)
- **Type Checking**: `yarn type-check` before commits

### Backend Testing

- **Unit Tests**: Jest for services and utilities
- **Integration Tests**: Supertest for API endpoints
- **Database Tests**: Separate test database
- **Coverage**: Aim for 70%+ coverage on critical paths

---

## PERFORMANCE OPTIMIZATION

### Frontend

- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: next/image with proper sizing
- **Bundle Size**: Monitor with `yarn build` output
- **Caching**: Leverage Next.js caching strategies
- **Lazy Loading**: Defer non-critical components
- **Memoization**: `useMemo`, `useCallback`, `React.memo` when appropriate

### Backend

- **Database Queries**: Proper indexes, avoid N+1 queries
- **Caching**: Consider Redis for frequently accessed data (future)
- **Pagination**: Always paginate large datasets
- **Compression**: gzip/brotli for responses
- **Connection Pooling**: MongoDB connection pool configured

---

## AI INTEGRATION (Google Gemini)

### Request Patterns

- **Rate Limiting**: 30/day (free), 100/day (premium)
- **Quota Tracking**: Update `aiRequestsRemaining` after each call
- **Error Handling**: Graceful fallback if AI fails
- **Prompt Engineering**: Clear, structured prompts with JSON response format
- **Token Management**: Track usage, optimize prompts

### AI Features

1. **Vocabulary Enhancement**: Improve meanings, examples, synonyms, antonyms
2. **Practice Feedback**: Evaluate user answers with AI
3. **Learning Insights**: Future analytics and recommendations

---

## GIT & VERSION CONTROL

### Commit Messages

- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(ai): add antonyms to vocabulary enhancement`

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/[name]`: New features
- `fix/[name]`: Bug fixes

### Pull Requests

- Clear description of changes
- Include screenshots for UI changes
- Link to related issues
- Ensure all tests pass

---

## DOCUMENTATION REQUIREMENTS

### Code Comments

- **TSDoc/JSDoc**: For all exported functions
- **Complex Logic**: Explain why, not what
- **TODO Comments**: Include issue number or name
- **Example**:
  ```typescript
  /**
   * Enhances vocabulary word with AI-generated content
   * @param word - The word to enhance
   * @param meaning - Current dictionary meaning
   * @param context - Learning level (beginner/intermediate/advanced)
   * @returns Enhanced vocabulary data including synonyms, antonyms, examples
   * @throws {HttpError} If AI service fails or quota exceeded
   */
  async function enhanceVocabulary(
    word: string,
    meaning: string,
    context: string
  ) {
    // Implementation
  }
  ```

### README Files

- Clear setup instructions
- Environment variables documented
- API endpoints documented
- Architecture diagrams for complex features

---

## DEPLOYMENT CONSIDERATIONS

### Environment Variables

- **Frontend** (`.env.local`):
  - `NEXT_PUBLIC_API_URL`
- **Backend** (`.env`):
  - `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - `AI_FREE_DAILY_LIMIT`, `AI_PREMIUM_DAILY_LIMIT`

### Build Process

- Frontend: `yarn build` → Optimized Next.js build
- Backend: `yarn build` → TypeScript compiled to JavaScript
- Vercel: Automatic deployments from `main` branch

---

## COMMON PITFALLS TO AVOID

### ❌ Don't:

- Store tokens in cookies (use Redux + localStorage)
- Use `any` type without good reason
- Forget to handle loading and error states
- Skip input validation
- Hard-code API URLs or secrets
- Mix server and client components incorrectly
- Ignore TypeScript errors
- Commit `.env` files
- Use synchronous blocking code
- Double-hash passwords (let model pre-save hook handle it)

### ✅ Do:

- Use TypeScript strictly
- Handle all async operations with try-catch
- Provide user feedback for all actions
- Test authentication flows thoroughly
- Keep components small and focused
- Use proper HTTP status codes
- Document complex logic
- Follow the existing code style
- Check for Redux state before cookies/localStorage
- Validate all inputs on both frontend and backend

---

## GETTING HELP

### When Stuck

1. Check existing similar implementations in codebase
2. Review API documentation (Next.js, Redux Toolkit, etc.)
3. Test in isolation before integrating
4. Ask user for clarification on requirements

### Code Review Checklist

- [ ] TypeScript types are correct
- [ ] Error handling is in place
- [ ] Loading states are handled
- [ ] Responsive design works
- [ ] Authentication works correctly
- [ ] No console errors or warnings
- [ ] Code follows project patterns
- [ ] Tests pass (if applicable)

---

## FINAL REMINDERS

🎯 **Quality over Speed** - Take time to do it right
🧪 **Test Thoroughly** - Especially authentication and AI features
📚 **Document Well** - Future you will thank you
🔒 **Security First** - Validate everything
♿ **Accessibility Matters** - Everyone should be able to use VocabPrep
🎨 **Consistent UI** - Follow established design patterns
💬 **Communicate** - Explain changes, ask questions, provide updates

---

_Last Updated: November 21, 2025_
_VocabPrep - AI-Powered English Vocabulary Learning Platform_

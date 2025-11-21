# 🤖 Gemini AI Integration - EnglishPrep Application

## 📋 Project Overview

Integration of Google's Gemini 2.0 Flash AI model to enhance vocabulary learning with intelligent features while implementing robust user-based rate limiting and subscription tiers.

### 🎯 Key Features

1. **AI-Powered Vocabulary Enhancement**

   - Simplify dictionary definitions for learners
   - Generate contextual example sentences
   - Suggest difficulty levels automatically
   - Recommend relevant topic tags
   - Create memory mnemonics and tips

2. **Intelligent Practice Feedback**

   - Evaluate user answers in real-time
   - Provide constructive, personalized feedback
   - Rate answer quality (1-5 scale)
   - Suggest improvements and alternatives

3. **Subscription Tiers**

   - **Free Tier**: 100 AI requests per day
   - **Premium Tier**: 500 AI requests per month ($3.99/month)

4. **Admin Dashboard**

   - View all users and their AI usage statistics
   - Monitor system-wide AI consumption
   - Manage user subscription tiers

5. **User Dashboard**
   - Track personal AI usage (requests used, remaining quota)
   - View usage history and patterns
   - Upgrade to premium option

---

## 🏗️ Architecture Overview

### Backend Architecture

```
backend/src/
├── config/
│   ├── database.ts           [existing]
│   ├── env.ts                [✏️ modify - add GEMINI_API_KEY]
│   └── gemini.ts             [✨ new - Gemini client config]
├── middlewares/
│   ├── authenticate.ts       [existing]
│   ├── aiRateLimit.ts        [✨ new - rate limiting middleware]
│   └── isAdmin.ts            [✨ new - admin authorization]
├── modules/
│   ├── ai/
│   │   ├── ai.controller.ts      [✨ new]
│   │   ├── ai.service.ts         [✨ new]
│   │   ├── ai.routes.ts          [✨ new]
│   │   ├── ai.schema.ts          [✨ new]
│   │   ├── aiUsage.model.ts      [✨ new]
│   │   └── aiUsage.service.ts    [✨ new]
│   ├── admin/
│   │   ├── admin.controller.ts   [✨ new]
│   │   ├── admin.routes.ts       [✨ new]
│   │   └── admin.service.ts      [✨ new]
│   ├── auth/
│   │   └── user.model.ts         [✏️ modify - add subscription fields]
│   └── practice/
│       └── practice.model.ts     [✏️ modify - store AI feedback]
└── routes/
    └── index.ts              [✏️ modify - register new routes]
```

### Frontend Architecture

```
frontend/src/
├── app/
│   ├── add-word/
│   │   └── page.tsx              [✏️ modify - AI enhancement button]
│   ├── practice/
│   │   └── page.tsx              [✏️ modify - AI feedback button]
│   ├── pricing/
│   │   └── page.tsx              [✨ new - pricing comparison]
│   ├── dashboard/
│   │   └── page.tsx              [✨ new - user AI usage dashboard]
│   └── admin/
│       └── page.tsx              [✨ new - admin dashboard]
├── components/
│   ├── layout/
│   │   ├── site-header.tsx       [✏️ modify - AI quota indicator]
│   │   └── user-dropdown.tsx     [✏️ modify - admin link]
│   └── sections/
│       ├── ai-dashboard.tsx      [✨ new - usage stats component]
│       └── pricing-card.tsx      [✨ new - pricing tier card]
└── redux/
    └── features/
        └── ai/
            ├── aiApi.ts          [✨ new - RTK Query endpoints]
            └── aiSlice.ts        [✨ new - AI state management]
```

---

## 📊 Database Schema Changes

### 1. User Model (Modified)

```typescript
interface IUser {
  // Existing fields
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;

  // ✨ New fields for AI & Subscription
  subscriptionTier: "free" | "premium"; // Default: 'free'
  aiRequestsRemaining: number; // Daily/Monthly quota
  aiResetDate: Date; // When quota resets
  isAdmin: boolean; // Default: false
  stripeCustomerId?: string; // For premium payments (future)
  subscriptionExpiresAt?: Date; // Premium expiration

  createdAt: Date;
  updatedAt: Date;
}
```

### 2. AI Usage Model (New)

```typescript
interface IAIUsage {
  userId: ObjectId; // Ref: User
  endpoint: string; // e.g., "/ai/enhance-vocab"
  requestTimestamp: Date;
  tokensUsed: number;
  responseTime: number; // milliseconds
  success: boolean;
  errorMessage?: string;

  // Request context
  vocabularyId?: ObjectId;
  practiceId?: ObjectId;

  createdAt: Date;
}

// Indexes:
// - {userId: 1, createdAt: -1}
// - {createdAt: 1} - TTL index (auto-delete after 90 days)
```

### 3. Practice Model (Modified)

```typescript
interface IPracticeEntry {
  // Existing fields
  exam: "IELTS" | "TOEFL" | "GRE";
  skill: "reading" | "listening" | "writing" | "speaking";
  prompt: string;
  yourAnswer: string;

  // ✨ Enhanced feedback field
  feedbackOrNotes?: string; // User notes OR AI feedback
  aiGenerated?: boolean; // True if AI generated feedback
  aiRating?: number; // 1-5 quality rating
  aiTokensUsed?: number;

  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔌 API Endpoints

### AI Endpoints (`/api/v1/ai`)

| Method | Endpoint                | Auth | Rate Limited | Description                 |
| ------ | ----------------------- | ---- | ------------ | --------------------------- |
| POST   | `/ai/enhance-vocab`     | ✅   | ✅           | Enhance vocabulary with AI  |
| POST   | `/ai/practice-feedback` | ✅   | ✅           | Get AI feedback on practice |
| GET    | `/ai/usage`             | ✅   | ❌           | Get user's AI usage stats   |
| GET    | `/ai/quota`             | ✅   | ❌           | Get remaining quota         |

#### POST `/ai/enhance-vocab`

**Request:**

```json
{
  "word": "serendipity",
  "meaning": "The occurrence of events by chance in a happy or beneficial way",
  "context": "intermediate"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "enhancedMeaning": "A pleasant surprise or happy accident; finding something good without looking for it",
    "exampleSentences": [
      "Finding a $20 bill in my old jacket was pure serendipity.",
      "Their meeting was serendipity - both were at the wrong conference room.",
      "The scientist's discovery was a moment of serendipity in the lab."
    ],
    "suggestedDifficulty": "medium",
    "suggestedTopicTags": ["Emotions", "Life Events", "Literature"],
    "memoryTip": "Think: 'Serene + dip' = peacefully dipping into good luck!",
    "synonyms": ["chance", "luck", "fortune", "coincidence"],
    "tokensUsed": 245
  },
  "quota": {
    "remaining": 99,
    "resetDate": "2025-11-22T00:00:00Z"
  }
}
```

#### POST `/ai/practice-feedback`

**Request:**

```json
{
  "vocabularyId": "673f1234567890abcdef1234",
  "word": "serendipity",
  "userAnswer": "Yesterday I had a serendipity when I found my lost keys in the garden.",
  "skill": "writing"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "rating": 3,
    "feedback": "Good attempt! You've used 'serendipity' in a relevant context. However, 'serendipity' is a noun that describes the occurrence itself, not something you 'have'. Consider: 'Yesterday, by serendipity, I found my lost keys in the garden.'",
    "suggestions": [
      "Replace 'I had a serendipity' with 'by serendipity' or 'it was serendipitous'",
      "Alternative: 'Finding my lost keys in the garden was serendipity.'"
    ],
    "encouragement": "You're on the right track! Keep practicing with concrete examples.",
    "tokensUsed": 178
  },
  "quota": {
    "remaining": 98,
    "resetDate": "2025-11-22T00:00:00Z"
  }
}
```

#### GET `/ai/usage`

**Response:**

```json
{
  "success": true,
  "data": {
    "currentPeriod": {
      "used": 2,
      "remaining": 98,
      "limit": 100,
      "resetDate": "2025-11-22T00:00:00Z",
      "periodType": "daily"
    },
    "subscriptionTier": "free",
    "totalLifetimeRequests": 847,
    "recentUsage": [
      {
        "date": "2025-11-21",
        "requests": 2,
        "tokensUsed": 423
      },
      {
        "date": "2025-11-20",
        "requests": 8,
        "tokensUsed": 1789
      }
    ]
  }
}
```

### Admin Endpoints (`/api/v1/admin`)

| Method | Endpoint                            | Auth | Admin Only | Description                     |
| ------ | ----------------------------------- | ---- | ---------- | ------------------------------- |
| GET    | `/admin/users`                      | ✅   | ✅         | List all users with pagination  |
| GET    | `/admin/ai-stats`                   | ✅   | ✅         | System-wide AI usage statistics |
| GET    | `/admin/users/:userId/ai-usage`     | ✅   | ✅         | Specific user's AI usage        |
| PATCH  | `/admin/users/:userId/subscription` | ✅   | ✅         | Update user subscription tier   |

---

## ⚙️ Rate Limiting Strategy

### Subscription Tiers

| Tier        | Cost        | Limit        | Reset Period                     | Overage             |
| ----------- | ----------- | ------------ | -------------------------------- | ------------------- |
| **Free**    | $0          | 100 requests | Daily (resets at midnight UTC)   | Blocked until reset |
| **Premium** | $3.99/month | 500 requests | Monthly (resets on billing date) | Blocked until reset |

### Rate Limit Logic

```typescript
// Rate limit middleware flow
async function aiRateLimitMiddleware(req, res, next) {
  const user = req.user;
  const now = new Date();

  // Check if quota needs reset
  if (now > user.aiResetDate) {
    await resetUserQuota(user);
  }

  // Check if user has remaining requests
  if (user.aiRequestsRemaining <= 0) {
    return res.status(429).json({
      success: false,
      error: "AI request limit exceeded",
      quota: {
        remaining: 0,
        resetDate: user.aiResetDate,
        tier: user.subscriptionTier,
      },
      upgradeUrl: "/pricing",
    });
  }

  // Decrement quota
  user.aiRequestsRemaining -= 1;
  await user.save();

  next();
}
```

### Token Tracking (Secondary Limit)

- Free tier: 50,000 tokens/day max
- Premium tier: 250,000 tokens/month max
- If exceeded, soft block with warning (can use remaining requests at reduced capacity)

---

## 💰 Pricing Page Design

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│           Choose Your Learning Plan                  │
│     Start with Free, Upgrade When You're Ready      │
└─────────────────────────────────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│   FREE TIER         │  │  PREMIUM TIER       │
│                     │  │                     │
│   $0/forever        │  │  $3.99/month        │
│                     │  │                     │
│ ✓ 100 AI requests   │  │ ✓ 500 AI requests   │
│   per day           │  │   per month         │
│ ✓ Vocabulary help   │  │ ✓ Everything in     │
│ ✓ Practice feedback │  │   Free              │
│ ✓ All features      │  │ ✓ Priority support  │
│                     │  │ ✓ No daily limits   │
│ [ Current Plan ]    │  │ [ Upgrade Now ]     │
└─────────────────────┘  └─────────────────────┘

             ┌─────────────────────┐
             │  COMPARE FEATURES   │
             └─────────────────────┘
```

### Pricing Card Component

```typescript
interface PricingTier {
  name: string;
  price: number;
  period: "day" | "month";
  requests: number;
  features: string[];
  badge?: "Popular" | "Best Value";
  ctaText: string;
  highlighted: boolean;
}
```

---

## 🎨 UI/UX Design Guidelines

### Color Scheme for AI Features

- **AI Accent Color**: `hsl(280, 100%, 70%)` - Purple gradient for AI badges
- **Success State**: `hsl(142, 76%, 36%)` - Green for successful AI responses
- **Warning State**: `hsl(48, 96%, 53%)` - Yellow for quota warnings
- **Error State**: `hsl(0, 84%, 60%)` - Red for rate limit errors

### Component Design Patterns

#### 1. AI Enhancement Button (Add Word Page)

```tsx
<Button
  variant="outline"
  className="relative overflow-hidden group"
  disabled={isEnhancing || aiQuota <= 0}
>
  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
  Enhance with AI
  <Badge className="ml-2 bg-purple-500">{aiQuota} left</Badge>
</Button>
```

#### 2. AI Quota Badge (Header)

```tsx
<div className="flex items-center gap-2 text-sm">
  <Zap className="h-4 w-4 text-purple-500" />
  <span className={quotaColor}>
    {remainingQuota}/{totalQuota}
  </span>
  {tier === "free" && (
    <Button size="sm" variant="link">
      Upgrade
    </Button>
  )}
</div>
```

#### 3. Usage Dashboard Chart

- **Chart Type**: Area chart for daily/monthly usage trends
- **Library**: Recharts (already in project)
- **Data Points**: Last 7 days (free) or 30 days (premium)
- **Metrics**: Requests used, tokens consumed, success rate

---

## 🔐 Security Considerations

### 1. API Key Security

```bash
# .env (never commit)
GEMINI_API_KEY=AIzaSyC...your-key-here
GEMINI_MODEL=gemini-2.0-flash

# Stored in environment variables
# Accessed via env.ts validation
```

### 2. Input Sanitization

```typescript
// ai.schema.ts
const enhanceVocabSchema = z.object({
  word: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z\s-]+$/),
  meaning: z.string().min(1).max(500),
  context: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});
```

### 3. Rate Limit Bypass Prevention

- IP-based secondary rate limiting (1000 req/hour per IP)
- Admin activity logging
- JWT token validation on every AI request
- Redis-based distributed rate limiting (future enhancement)

### 4. Admin Authorization

```typescript
// isAdmin middleware
export const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    throw new HttpError(403, "Admin access required");
  }
  next();
};
```

---

## 📈 Monitoring & Analytics

### Tracked Metrics

1. **Per-User Metrics**

   - Total AI requests made
   - Tokens consumed
   - Average response time
   - Success/failure rate
   - Most used features

2. **System-Wide Metrics**

   - Daily active AI users
   - Total API calls to Gemini
   - Cost tracking (tokens × pricing)
   - Error rates by endpoint
   - Peak usage times

3. **Business Metrics**
   - Free → Premium conversion rate
   - Premium churn rate
   - Average AI requests per user
   - Feature adoption rates

---

## 🚀 Implementation Steps

### Phase 1: Backend Infrastructure (Days 1-2)

#### Step 1.1: Environment Configuration

- [ ] Add `GEMINI_API_KEY` to `.env`
- [ ] Update `backend/src/config/env.ts` with Gemini validation
- [ ] Create `backend/src/config/gemini.ts` for client initialization
- [ ] Update `.env.example` with new variables

#### Step 1.2: Database Models

- [ ] Create `backend/src/modules/ai/aiUsage.model.ts`
- [ ] Update `backend/src/modules/auth/user.model.ts` with subscription fields
- [ ] Update `backend/src/modules/practice/practice.model.ts` for AI feedback
- [ ] Run database migration script (add default values to existing users)

#### Step 1.3: Middleware

- [ ] Create `backend/src/middlewares/aiRateLimit.ts`
- [ ] Create `backend/src/middlewares/isAdmin.ts`
- [ ] Test rate limiting logic with unit tests

### Phase 2: Backend AI Services (Days 3-4)

#### Step 2.1: AI Core Services

- [ ] Create `backend/src/modules/ai/aiUsage.service.ts` (quota management)
- [ ] Create `backend/src/modules/ai/ai.service.ts` (Gemini API integration)
  - Implement `enhanceVocabulary()` method
  - Implement `generatePracticeFeedback()` method
  - Add error handling and retries

#### Step 2.2: AI Controllers & Routes

- [ ] Create `backend/src/modules/ai/ai.schema.ts` (Zod validation)
- [ ] Create `backend/src/modules/ai/ai.controller.ts`
  - `enhanceVocab` endpoint
  - `practiceFeedback` endpoint
  - `getUsage` endpoint
  - `getQuota` endpoint
- [ ] Create `backend/src/modules/ai/ai.routes.ts`

#### Step 2.3: Admin Services

- [ ] Create `backend/src/modules/admin/admin.service.ts`
- [ ] Create `backend/src/modules/admin/admin.controller.ts`
- [ ] Create `backend/src/modules/admin/admin.routes.ts`

#### Step 2.4: Wire Up Routes

- [ ] Update `backend/src/routes/index.ts` to register AI and admin routes
- [ ] Test all endpoints with Postman/Thunder Client

### Phase 3: Frontend Redux Setup (Day 5)

#### Step 3.1: Redux AI Feature

- [ ] Create `frontend/src/redux/features/ai/aiApi.ts`
  - Define RTK Query endpoints for all AI operations
  - Add optimistic updates for quota changes
- [ ] Create `frontend/src/redux/features/ai/aiSlice.ts`
  - State: current quota, tier, usage stats
  - Actions: update quota, set tier

#### Step 3.2: Admin Redux Feature

- [ ] Create `frontend/src/redux/features/admin/adminApi.ts`
  - Endpoints for user management
  - Endpoints for AI statistics

### Phase 4: Frontend Core Pages (Days 6-7)

#### Step 4.1: Pricing Page

- [ ] Create `frontend/src/app/pricing/page.tsx`
- [ ] Create `frontend/src/components/sections/pricing-card.tsx`
- [ ] Design responsive layout (mobile + desktop)
- [ ] Add hover effects and animations
- [ ] Add "Current Plan" badge for logged-in users

#### Step 4.2: User Dashboard

- [ ] Create `frontend/src/app/dashboard/page.tsx`
- [ ] Create `frontend/src/components/sections/ai-dashboard.tsx`
  - Usage statistics card
  - Quota progress bar
  - Usage history chart (Recharts)
  - Upgrade CTA (if free tier)

#### Step 4.3: Admin Dashboard

- [ ] Create `frontend/src/app/admin/page.tsx`
  - User list table with pagination
  - AI usage statistics overview
  - Search/filter users
  - Subscription tier management
  - Export data functionality

### Phase 5: Feature Integration (Days 8-9)

#### Step 5.1: Add Word Page Integration

- [ ] Update `frontend/src/app/add-word/page.tsx`
- [ ] Add "✨ Enhance with AI" button after dictionary fetch
- [ ] Show loading skeleton during AI processing
- [ ] Display AI suggestions in form fields (with edit capability)
- [ ] Show success toast with tokens used (Sonner)
- [ ] Handle rate limit errors gracefully

#### Step 5.2: Practice Page Integration

- [ ] Update `frontend/src/app/practice/page.tsx`
- [ ] Add "Get AI Feedback" button after user submits answer
- [ ] Display AI feedback in dedicated section
- [ ] Show rating stars (1-5)
- [ ] Display suggestions as bullet points
- [ ] Show success/error toast (Sonner)

#### Step 5.3: Header & Navigation Updates

- [ ] Update `frontend/src/components/layout/site-header.tsx`
  - Add AI quota badge for logged-in users
  - Color-code quota (green > 50%, yellow 20-50%, red < 20%)
  - Add link to dashboard
- [ ] Update `frontend/src/components/layout/user-dropdown.tsx`
  - Add "Admin Dashboard" link (if isAdmin)
  - Add "My AI Usage" link
  - Add "Upgrade to Premium" link (if free tier)

### Phase 6: Polish & Testing (Day 10)

#### Step 6.1: Error Handling

- [ ] Add comprehensive error messages
- [ ] Implement fallback UI for AI failures
- [ ] Add retry logic for transient errors
- [ ] Test offline behavior

#### Step 6.2: Loading States

- [ ] Add skeleton loaders for AI responses
- [ ] Implement progress indicators
- [ ] Add pulse animations for processing

#### Step 6.3: Toast Notifications (Sonner)

- [ ] Success: "AI enhancement complete! 🎉"
- [ ] Error: "AI request failed. Please try again."
- [ ] Rate Limit: "Daily limit reached. Upgrade for more requests!"
- [ ] Warning: "Only 10 AI requests remaining today"

#### Step 6.4: Testing Checklist

- [ ] Test free tier daily reset (simulate with date change)
- [ ] Test premium tier monthly reset
- [ ] Test rate limit enforcement
- [ ] Test admin features (CRUD operations)
- [ ] Test AI response quality
- [ ] Test error scenarios (network failure, invalid input)
- [ ] Test mobile responsiveness
- [ ] Test accessibility (keyboard navigation, screen readers)

### Phase 7: Documentation & Deployment

#### Step 7.1: Documentation

- [ ] Update main README.md with AI features
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Create user guide for AI features
- [ ] Document environment variables

#### Step 7.2: Deployment

- [ ] Set `GEMINI_API_KEY` in Vercel environment variables (backend)
- [ ] Deploy backend to Vercel
- [ ] Deploy frontend to Vercel
- [ ] Test production environment
- [ ] Monitor Gemini API usage and costs

---

## 🧪 Testing Scenarios

### Unit Tests

```typescript
// ai.service.test.ts
describe("AI Service", () => {
  test("enhanceVocabulary returns valid structure", async () => {
    const result = await aiService.enhanceVocabulary({
      word: "serendipity",
      meaning: "happy accident",
    });

    expect(result).toHaveProperty("enhancedMeaning");
    expect(result.exampleSentences).toHaveLength(3);
    expect(result.tokensUsed).toBeGreaterThan(0);
  });

  test("throws error when API key is invalid", async () => {
    // Test error handling
  });
});

// aiRateLimit.test.ts
describe("AI Rate Limit Middleware", () => {
  test("blocks request when quota is 0", async () => {
    // Mock user with 0 remaining
    // Expect 429 status
  });

  test("resets quota after reset date", async () => {
    // Test daily reset logic
  });
});
```

### Integration Tests

```typescript
// ai.integration.test.ts
describe("AI Endpoints", () => {
  test("POST /ai/enhance-vocab returns AI suggestions", async () => {
    const response = await request(app)
      .post("/api/v1/ai/enhance-vocab")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ word: "ephemeral", meaning: "lasting a short time" });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("enhancedMeaning");
  });

  test("returns 429 when rate limit exceeded", async () => {
    // Make 101 requests
    // Expect last one to be 429
  });
});
```

### E2E Tests (Playwright)

```typescript
test("User can enhance vocabulary with AI", async ({ page }) => {
  await page.goto("/add-word");
  await page.fill('input[name="word"]', "serendipity");
  await page.click('button:has-text("Search")');
  await page.click('button:has-text("Enhance with AI")');

  await expect(page.locator(".ai-suggestions")).toBeVisible();
  await expect(page.locator(".toast")).toContainText("AI enhancement complete");
});
```

---

## 📊 Cost Estimation

### Gemini 2.0 Flash Pricing (Free Tier)

| Metric       | Free Tier Limit | Expected Usage | Status  |
| ------------ | --------------- | -------------- | ------- |
| Requests/day | 200             | ~50-100        | ✅ Safe |
| Tokens/min   | 1M              | ~5K-10K        | ✅ Safe |
| Tokens/day   | Unlimited       | ~20K-40K       | ✅ Safe |

### Cost Projection (if exceeded free tier)

**Scenario: 1000 active users**

- Free users: 900 (100 req/day each) = 90,000 req/day
- Premium users: 100 (16.6 req/day avg) = 1,660 req/day
- **Total: ~92,000 requests/day** → **Requires paid tier**

**Paid Tier Costs:**

- Average tokens per request: ~250
- Daily tokens: 92,000 × 250 = 23M tokens
- Input cost: 23M × $0.10 / 1M = **$2.30/day**
- Output cost: 23M × $0.40 / 1M = **$9.20/day**
- **Monthly cost: ~$345**

**Revenue from Premium:**

- 100 premium users × $3.99 = **$399/month**
- **Profit: $399 - $345 = $54/month**

### Cost Optimization Strategies

1. **Caching**: Cache common AI responses (e.g., popular words)
2. **Prompt Engineering**: Reduce token usage with concise prompts
3. **Batch Requests**: Combine multiple enhancements when possible
4. **Progressive Enhancement**: Start with dictionary, add AI on demand
5. **Increase Premium Price**: Consider $4.99 or $5.99/month

---

## 🎯 Success Metrics

### User Engagement

- **AI Feature Adoption**: % of users who use AI features
- **Daily Active AI Users**: Users making AI requests
- **Feature Retention**: Users returning to AI features
- **Quota Utilization**: Average % of quota used

### Business Metrics

- **Conversion Rate**: Free → Premium upgrades
- **Monthly Recurring Revenue (MRR)**: From premium subscriptions
- **Churn Rate**: Premium cancellations
- **Customer Lifetime Value (CLV)**

### Technical Metrics

- **API Response Time**: p50, p95, p99 latencies
- **Success Rate**: % of successful AI requests
- **Error Rate**: % of failed requests
- **Cost per Request**: Average Gemini API cost

---

## 🔮 Future Enhancements

### Phase 2 Features (Post-Launch)

1. **Payment Integration**

   - Stripe subscription checkout
   - Automatic quota renewal
   - Invoice generation

2. **Advanced AI Features**

   - Personalized vocabulary recommendations
   - Spaced repetition algorithm with AI
   - Voice pronunciation feedback (multimodal AI)
   - Image-to-vocabulary learning

3. **Team/Educational Plans**

   - Teacher dashboard
   - Student progress tracking
   - Classroom vocabulary sets
   - Bulk AI credits for institutions

4. **Analytics Dashboard**

   - Learning progress visualization
   - Vocabulary mastery heatmap
   - AI effectiveness metrics
   - Personalized study recommendations

5. **Performance Optimizations**
   - Redis caching layer
   - Response compression
   - CDN integration
   - Database query optimization

---

## 📝 Environment Variables Reference

### Backend (`.env`)

```bash
# Existing
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://...
DB_NAME=EnglishPrep
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourapp.com/api/v1/auth/google/callback
API_BASE_PATH=/api/v1

# ✨ New - Gemini AI
GEMINI_API_KEY=AIzaSyC...your_gemini_key_here
GEMINI_MODEL=gemini-2.0-flash
AI_FREE_DAILY_LIMIT=100
AI_PREMIUM_MONTHLY_LIMIT=500
AI_MAX_TOKENS_PER_REQUEST=1000
AI_TIMEOUT_MS=30000

# Future - Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PREMIUM_PRICE_ID=price_...
```

### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Rate Limit Not Resetting

**Symptom**: Users still blocked after reset time
**Solution**: Check timezone handling, ensure UTC timestamps

```typescript
// Correct: Use UTC for consistency
const resetDate = new Date();
resetDate.setUTCHours(24, 0, 0, 0);
```

#### 2. Gemini API Timeout

**Symptom**: AI requests hanging or timing out
**Solution**: Set timeout, implement retry logic

```typescript
const response = await fetch(geminiUrl, {
  signal: AbortSignal.timeout(30000), // 30s timeout
});
```

#### 3. Token Count Mismatch

**Symptom**: Usage tracking shows wrong token counts
**Solution**: Use Gemini's returned `usageMetadata`

```typescript
const { totalTokenCount } = response.usageMetadata;
await trackTokenUsage(userId, totalTokenCount);
```

#### 4. Admin Access Not Working

**Symptom**: Admin sees 403 errors
**Solution**: Check `isAdmin` field in user document

```bash
# MongoDB shell
db.users.updateOne(
  { email: 'admin@example.com' },
  { $set: { isAdmin: true } }
);
```

---

## 📚 Resources

### Documentation

- [Gemini 2.0 Flash API Docs](https://ai.google.dev/gemini-api/docs/text-generation)
- [Google AI SDK for JavaScript](https://github.com/google/generative-ai-js)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies)

### Design References

- [Pricing Page Examples](https://stripe.com/pricing)
- [Dashboard Design Patterns](https://www.nngroup.com/articles/dashboard-design/)
- [AI UI Patterns](https://www.patterns.dev/ai)

### Tools

- **Testing**: Jest, Supertest, Playwright
- **Monitoring**: Vercel Analytics, Google Cloud Monitoring
- **Database**: MongoDB Compass, Atlas Dashboard
- **API Testing**: Postman, Thunder Client

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Gemini API key tested and working
- [ ] Database migrations run on production
- [ ] Admin user created (set `isAdmin: true`)
- [ ] Rate limiting tested with multiple scenarios
- [ ] All AI endpoints return proper error messages
- [ ] Frontend error handling tested
- [ ] Mobile responsiveness verified
- [ ] Pricing page copy reviewed
- [ ] Terms of Service updated (if needed)
- [ ] Privacy Policy updated (AI data usage)
- [ ] Monitoring/alerting configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented

---

## 🎉 Launch Strategy

### Soft Launch (Week 1)

1. Enable for 10% of users (A/B test)
2. Monitor error rates and usage patterns
3. Gather user feedback
4. Fix critical bugs

### Public Launch (Week 2)

1. Enable for all users
2. Announce on social media
3. Send email to existing users
4. Monitor server load and API costs
5. Prepare to scale if needed

### Post-Launch (Week 3+)

1. Analyze conversion rates
2. Optimize AI prompts based on feedback
3. Plan premium marketing campaigns
4. Iterate on features

---

**Last Updated**: November 21, 2025  
**Version**: 1.0.0  
**Status**: Ready for Implementation 🚀

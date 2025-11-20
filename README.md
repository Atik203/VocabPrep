# VocabPrep – Master English Vocabulary

A modern, focused web application to help you **build and master English vocabulary** through interactive learning, practice sessions, and progress tracking.

## ✨ Key Features

- 📚 **Vocabulary Management** - Add, edit, and organize words with meanings, synonyms, antonyms
- 🇧🇩 **Bengali Support** - Includes Bengali meanings for better understanding
- 🎯 **Smart Practice Modes** - Flashcards, quizzes, and sentence practice
- 📊 **Progress Tracking** - Track your learning journey with stats and achievements
- 🔊 **Audio Pronunciation** - Learn correct pronunciation with audio support
- 🎨 **Modern UI** - Beautiful glass-morphism design with dark mode support
- 🔐 **Google OAuth** - Secure authentication with Google Sign-In
- 🌐 **Public Vocabulary** - Browse words without login, full features when authenticated

---

## 🎯 Project Goals

- Build a comprehensive vocabulary learning platform focused on mastering English words
- Provide interactive and engaging practice methods (flashcards, quizzes, sentences)
- Track progress and celebrate learning milestones
- Make vocabulary learning accessible and fun
- Support learners at all levels with difficulty-based categorization

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16.0.3** with App Router
- **React 19** + **TypeScript**
- **Redux Toolkit** with RTK Query for state management
- **Tailwind CSS v4** for styling
- **shadcn/ui** + **Radix UI** components
- **Framer Motion** for animations
- **Google OAuth** for authentication

### Backend

- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB** + **Mongoose 8.20.0**
- **Passport.js** for Google OAuth
- **Zod** for validation
- RESTful APIs for:
  - Vocabulary CRUD operations
  - User authentication
  - Progress tracking
  - Practice sessions

### Deployment

- **Backend**: Vercel-ready deployment
- **Database**: MongoDB Atlas
- **Authentication**: Cookie-based sessions with Google OAuth

---

## 🏗️ Architecture

### Backend API Structure

- **Express Server**
  - Handles all CRUD operations for vocabulary
  - User authentication with Google OAuth
  - Progress tracking and statistics
  - Cookie-based session management

### Frontend Architecture

- **Next.js App Router** for routing and server components
- **Redux Toolkit** for global state management
- **RTK Query** for API calls and caching
- **Client-side rendering** for interactive components
- **Server-side authentication** via middleware

---

## 📋 Core Features

### 1. Vocabulary Management 📚

**Add new words with comprehensive details:**

- `word` - The English word
- `meaning` - Definition in English
- `meaningBn` - Bengali translation
- `partOfSpeech` - Noun, verb, adjective, etc.
- `phonetic` - Phonetic notation
- `phoneticAudio` - Audio pronunciation URL
- `exampleSentence` - Usage example
- `synonyms` - Related words with similar meaning
- `antonyms` - Words with opposite meaning
- `difficulty` - `easy` | `medium` | `hard`
- `status` - `new` | `learning` | `learned`
- `notes` - Personal learning notes

**Smart Filtering:**

- Filter by difficulty level (easy, medium, hard)
- Filter by learning status (new, learning, learned)
- Search by word or meaning
- Sort and organize your vocabulary

**Word Management:**

- Edit or delete existing words
- Mark words as learning or learned
- Track progress for each word
- View detailed word information with pronunciation

### 2. Interactive Practice Modes 🎯

**Flashcard Mode:**
- Show word with definition
- Click to reveal or hide details
- Navigate through vocabulary deck
- Audio pronunciation playback

**Quiz Mode:**
- Type the correct word for a given meaning
- Instant feedback on correctness
- Score tracking during session
- Review incorrect answers

**Sentence Practice:**
- Write original sentences using new words
- Practice contextual usage
- Build writing skills
- Understand word application in context

### 3. Progress Tracking 📊

**Statistics Dashboard:**
- Total words in your vocabulary
- Number of learned words
- Learning progress percentage
- Words added per day average
- Days active on platform

**Achievements System:**
- 🎖️ First Word - Added your first vocabulary word
- ⚡ Quick Learner - Added 10 words in one day
- 🏆 Vocabulary Master - Reached 100 words
- 🔥 Consistent Learner - 7-day learning streak

**Learned Words Gallery:**
- Visual display of mastered vocabulary
- Difficulty-based color coding
- Quick access to word details
- Track your learning journey

### 4. User Authentication 🔐

**Google OAuth Integration:**
- Secure sign-in with Google account
- Profile management
- Personalized learning experience
- Progress saved to your account

**Public Access:**
- Browse vocabulary without login
- View word details publicly
- Full features available after authentication
- Edit and track progress when logged in

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Google OAuth credentials

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=VocabPrep
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📁 Project Structure

```
EnglishPrep/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middlewares/    # Express middlewares
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication
│   │   │   ├── vocabulary/ # Vocabulary CRUD
│   │   │   └── practice/   # Practice sessions
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   └── api/
│       └── index.ts        # Vercel serverless entry
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # React components
│   │   ├── redux/          # Redux store & slices
│   │   └── lib/            # Utilities & helpers
│   └── public/             # Static assets
└── README.md
```

---

## 🎨 Design System

VocabPrep uses a modern design system with:

- **Glass Morphism** - Frosted glass effect for cards
- **Gradient Accents** - Colorful gradients for visual appeal
- **Dark Mode** - Full dark mode support
- **Animations** - Smooth transitions with Framer Motion
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components

---

## 🔮 Future Enhancements

### Planned Features

- **Spaced Repetition** - Smart review scheduling based on forgetting curve
- **Word of the Day** - Daily vocabulary challenges
- **Learning Streaks** - Track consecutive days of learning
- **Export/Import** - Backup and restore vocabulary data
- **Mobile App** - Native mobile application
- **Collaborative Learning** - Share and learn with friends
- **Advanced Analytics** - Detailed learning insights
- **Custom Categories** - Create personalized word collections
- **API Integration** - Connect with external dictionary APIs
- **Offline Mode** - Practice without internet connection

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Developer

**Atikur Rahman**
- GitHub: [@Atik203](https://github.com/atik203)
- Email: atik.cse1.1.2021@gmail.com

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you learn English vocabulary!

---

Built with ❤️ for English learners

# EnglishPrep English – Personal IELTS / TOEFL / GRE Prep Platform

A simple, focused web application to help with personal English preparation for **IELTS, TOEFL, and GRE**.

Phase 1 focuses on:

- Vocabulary tracking
- meaning
- Synonyms and antonyms
- Meaning in Bengali
- Example sentences
- Part of speech for each word
- Sentence-building practice
- Grammar notes
- Tense usage examples
- Sentence patterns
- Practice log entries
-

No login or user accounts initially – just fast, personal usage.

---

## 1. Project Goals

- Centralize all personal English prep (IELTS / TOEFL / GRE) in one place.
- Make it easy to:
  - Save and revise new vocabulary.
  - Log practice questions and mistakes.
  - Review tenses and practice forming correct sentences.
- Start **simple** (Phase 1: no auth, minimal UI, core features only).
- Keep the architecture ready for future expansion (auth, spaced repetition, analytics).

---

## 2. Tech Stack

### Backend

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- RESTful APIs for:

  - Vocabulary
  - Practice log
  - Tenses & sentence patterns (Phase 1 static / semi-static)

- vercel deploy ready

### Frontend (planned)

- Likely: **Next.js 16.0.3 + React 19 + TypeScript** .

### Backend

- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB** + **Mongoose 8.20.0**

---

Phase 1 focuses on a **small, shippable MVP**:

- Vocabulary tracking with filters
- Meanings (including Bengali meaning)
- Synonyms and antonyms
- Example sentences
- Part of speech for each word
- Tense usage examples (read-only reference)
- Practice log entries for questions & mistakes

No login or user accounts in Phase 1 – just fast, personal usage.
word

## 2. Tech Stack

### Backend (Phase 1)

- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB** + **Mongoose 8.20.0**
- RESTful APIs for:
  - Vocabulary
  - Practice log
  - Tense reference (Phase 1: static / semi-static)
- Deployment target: Vercel / Render / Railway (any Node-friendly host)

### Frontend (Phase 1)

- Likely: **Next.js 16.0.3 + React 19 + TypeScript**
- Very minimal UI:
  - Vocab list + create/edit form + simple filters
  - Practice log list + create form
  - Read-only tense reference page

## 3. High-Level Architecture (Phase 1)

- **Express API server**
  - Handles CRUD operations for vocab and practice entries.
  - Serves read-only tense reference data (from static JSON).
- **MongoDB**
  - Persists data for a single personal user (no auth in Phase 1).
- **Frontend client**
  - Makes API calls to backend and renders a minimal UI.

---

## 4. Phase 1 Functional Modules

### 4.1 Vocabulary Module

Add new words with fields:

- `word`
- `meaning`
- `meaningBn` (Bengali meaning)
- `exampleSentence`
- `synonyms` (array of strings)
- `antonyms` (array of strings)
- `examTags` (e.g., `["IELTS", "TOEFL"]`)
- `difficulty` (e.g., `easy` | `medium` | `hard`)
- `status` (`new` | `learning` | `learned`)

List all words with filters:

- By exam: IELTS / TOEFL / GRE
- By difficulty
- By status (e.g., show only `new` or `learning`)

Allow:

- Edit or delete words
- Mark word as `learned` / `learning`

Example use cases:

- “Add new GRE vocab and later filter only GRE + hard.”
- “Show only IELTS words I am still learning.”

### 4.2 Practice Log (Questions & Mistakes)

Create practice entries for:

- Reading
- Listening
- Writing
- Speaking

Each practice entry stores:

- `exam` (IELTS / TOEFL / GRE)
- `skill` (`reading` / `listening` / `writing` / `speaking`)
- `prompt` (question or topic)
- `yourAnswer`
- `feedbackOrNotes` (what was wrong, what to improve)
- `createdAt` timestamp

List all practice entries with filters:

- By exam
- By skill
- By date (recent first)

Use it as a mistake log to avoid repeating the same errors.

### 4.3 Tense Review (Reference)

Simple tenses reference data:

- Present, Past, Future
- Simple, Continuous, Perfect, Perfect Continuous

Each tense entry:

- `name` (e.g., `Present Perfect`)
- `structure` (e.g., `have/has + V3`)
- `usage` (when to use)
- `examples`

Implementation in Phase 1:

- Hard-coded JSON file in backend
- `GET /api/tenses` returns all tenses
- Frontend shows read-only table/cards

Personal notes or custom examples can be a Phase 2+ feature.

---

## 5. Future Phases

### Phase 2 – Enhancements (Optional / Future)

JWT-based sessions.

### Phase 3 – Auth, Spaced Repetition & Advanced Features

Allow multiple users (if you ever share this app).

Spaced Repetition

Add review schedule fields to vocab.

Automatically suggest which words to review today.

Progress Dashboard

Charts and stats:

Words learned over time.

Practice sessions per week.

Exam-specific modes

IELTS writing task templates.

TOEFL integrated speaking structure hints.

GRE vocab lists integration.

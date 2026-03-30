# SkillOpus — Learning Management System

<div align="center">
  <img src="Frontend/public/skillopus_logo.png" alt="SkillOpus Logo" width="80" />
  <h3>A purpose-built LMS for organisations to manage training end-to-end</h3>
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb" />
    <img src="https://img.shields.io/badge/Cloudinary-Video%20Storage-3448C5?style=flat-square&logo=cloudinary" />
    <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
  </p>
</div>

---

## Overview

**SkillOpus** is a full-stack Learning Management System designed for organisations to own and operate their training workflows. Instead of juggling external platforms or spreadsheets, organisations can create courses, onboard instructors, enrol students, and track completion — all in one place.

Each user has a role-specific experience:

| Role | What they do |
|---|---|
| **Admin** | Manage the organisation, create courses, assign instructors, approve enrolments, view stats |
| **Instructor** | Manage lessons and video content for assigned courses, track learner progress |
| **Student** | Browse and enrol in courses, complete lessons, track their own progress |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Lucide React | Icon library |
| React Toastify | Toast notifications |
| React Circular Progressbar | Progress visualisation |
| js-cookie | Cookie-based auth state |
| Vite | Build tool & dev server |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password hashing |
| Cloudinary + Multer | Video/file upload & streaming |
| cookie-parser | Cookie handling |
| dotenv | Environment config |

---

## Project Structure

```
SkillOpus/
├── Frontend/               # React + Vite application
│   ├── public/
│   │   └── skillopus_logo.png
│   ├── src/
│   │   ├── Components/     # All page and UI components
│   │   │   ├── About.jsx          # About + Contact + FAQ page
│   │   │   ├── AdminDashboard.jsx # Admin control panel
│   │   │   ├── Courses.jsx        # Course listing (browse + filter)
│   │   │   ├── CourseDetail.jsx   # Individual course + lessons
│   │   │   ├── CourseCard.jsx     # Course card component
│   │   │   ├── Header.jsx         # Navigation bar
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentProgress.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Organizations.jsx  # Public org listing page
│   │   │   ├── NotFound.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state (user details from cookie)
│   │   │   └── ThemeContext.jsx   # Dark/light mode toggle
│   │   └── App.jsx                # Route definitions
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
└── Backend/                # Node.js + Express API
    ├── config/
    │   └── db.js           # MongoDB connection
    ├── models/
    │   ├── User.js
    │   ├── Course.js
    │   ├── Enrollment.js
    │   └── Organization.js
    ├── controllers/
    │   ├── AuthController.js
    │   ├── CourseController.js
    │   ├── EnrollmentController.js
    │   ├── InstructorController.js
    │   ├── OrganizationController.js
    │   ├── OptionsController.js
    │   └── StatsController.js
    ├── routes/
    │   ├── AuthRouter.js
    │   ├── CourseRoutes.js
    │   ├── EnrollmentRoutes.js
    │   ├── InstructorRoutes.js
    │   ├── OrganizationRoutes.js
    │   ├── ProgressRoutes.js
    │   ├── OptionsRoutes.js
    │   └── StatsRoutes.js
    ├── middlewares/
    ├── index.js            # Entry point
    └── package.json
```

---

## Data Models

### User
```
username    String  (required)
email       String  (required, unique)
password    String  (hashed with bcrypt)
user_type   Enum    student | instructor | admin
contact     String
organization  ObjectId → Organization
department  String
created_at  Date
```

### Course
```
title         String  (required)
description   String
category      String
level         Enum    Beginner | Intermediate | Advanced
instructor    ObjectId → User
organization  ObjectId → Organization
status        Enum    draft | active | archived
lessons       [LessonSchema]
  └─ title         String
  └─ content_url   String  (Cloudinary video URL)
  └─ lesson_order  Number
created_at    Date
```

### Enrollment
```
student       ObjectId → User
course        ObjectId → Course
organization  ObjectId → Organization
status        Enum    pending | active | completed | dropped
enrolled_at   Date
progress      [LessonProgressSchema]
  └─ lesson_id     ObjectId
  └─ status        Boolean
  └─ completed_at  Date
```

### Organization
```
name        String (required)
created_at  Date
```

---

## API Routes

All routes are served from `http://localhost:3000` by default.

| Prefix | Router | Description |
|---|---|---|
| `/api/` | AuthRouter | Register, login, token validation |
| `/courses/` | CourseRoutes | CRUD for courses and lessons |
| `/enrollments/` | EnrollmentRoutes | Enrol, approve, drop, list |
| `/progress/` | ProgressRoutes | Mark lessons complete, fetch progress |
| `/stats/` | StatsRoutes | Dashboard stats (counts, completion rates) |
| `/instructors/` | InstructorRoutes | List instructors by organisation |
| `/organizations/` | OrganizationRoutes | List and fetch organisations |
| `/form/` | OptionsRoutes | Dropdown options (categories, levels) |

---

## Frontend Routes

| Path | Component | Auth Required |
|---|---|---|
| `/login` | Login | No |
| `/register` | Register | No |
| `/` | Home (role-based dashboard) | ✅ Yes |
| `/courses` | Courses | ✅ Yes |
| `/course/:id` | CourseDetail | ✅ Yes |
| `/progress/:id` | StudentProgress | ✅ Yes |
| `/about` | About + Contact + FAQ | No |
| `/organizations` | Organizations | No |
| `*` | NotFound | No |

---

## Features

### For Organisations (Admins)
- Create and manage courses with title, description, category, level, and instructor assignment
- Review and approve or decline student enrolment requests
- View live stats — total students, courses, completion rates
- Manage instructors registered under the organisation

### For Instructors
- Manage lessons within assigned courses
- Upload video content via Cloudinary
- Track which students are enrolled and their lesson-level progress

### For Students
- Browse all active courses with level filtering (Beginner / Intermediate / Advanced)
- Request enrolment and track approval status
- Watch video lessons and mark them as complete
- View personal progress with a completion percentage per course

### Platform-wide
- **Role-based navigation** — the header and dashboard adapt based on `user_type`
- **Dark / Light mode** — persisted via `ThemeContext`
- **Responsive design** — mobile-friendly with a collapsible nav
- **Animated UI** — page transitions and micro-animations via Framer Motion
- **Contact form** — powered by Formspree, embedded on the About page
- **FAQ accordion** — animated expand/collapse on the About page

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas cluster (or local MongoDB)
- A Cloudinary account (free tier is sufficient)
- A [Formspree](https://formspree.io) form endpoint (for the contact form)

---

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
REGISTER_SECRET=your_registration_secret_key
```

> `REGISTER_SECRET` is a shared secret required during user registration to prevent unauthorised sign-ups.

Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API runs on `http://localhost:3000` by default.

---

### Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
VITE_API_URL=http://localhost:3000
VITE_FORMSPREE_URL=https://formspree.io/f/your_form_id
```

Start the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173` by default.

---

## Authentication

- Users register with a `REGISTER_SECRET` to ensure only authorised sign-ups
- Passwords are hashed using **bcrypt** before storage
- On login, a **JWT** is issued and stored in a browser **cookie** (`jwt_token`)
- User details (username, email, role, organisation) are stored in a separate `userDetails` cookie
- `ProtectedRoute` validates the cookie on every protected page load
- Logging out clears both cookies and redirects to `/login`

---

## Environment Variables Reference

### Backend (`Backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLOUD_NAME` | Cloudinary cloud name |
| `API_KEY` | Cloudinary API key |
| `API_SECRET` | Cloudinary API secret |
| `REGISTER_SECRET` | Shared secret for user registration |

### Frontend (`Frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |
| `VITE_FORMSPREE_URL` | Formspree endpoint for the contact form |

---

## Author

**Shashank P.** — Full-Stack Developer  
Built end-to-end with React, Node.js, Express, and MongoDB.

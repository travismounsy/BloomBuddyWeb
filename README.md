Team Members: Travis Mounsy & Mollie Pathammavong

# 🌱 Bloom Buddy

Bloom Buddy is a full-stack habit tracking web application designed to make building consistent routines more engaging. Users create and schedule habits, track daily completions, monitor their progress, and grow a virtual plant as they complete their goals.

The project began as an Android mobile application and is being rebuilt as a modern web application with React, TypeScript, Tailwind CSS, and Supabase.

---

## ✨ Features

### Habit Management
- Create and delete habits
- Add descriptions and categories
- Assign custom colors to habits
- Set start and optional end dates
- Create daily, weekly, or monthly schedules
- Mark habits complete or incomplete
- View habits scheduled for a specific date

### 🌱 Interactive Bloom Buddy

Daily habit completion contributes to the growth of the user's Bloom Buddy.

The plant progresses through multiple growth stages:

1. Empty
2. Sprout
3. Small
4. Growing
5. Blooming
6. Full Bloom

Plant growth updates dynamically as habits are completed or uncompleted.

### 📅 Calendar

The calendar provides a monthly overview of scheduled habits and completion activity.

Users can:

- Navigate between months
- Jump back to the current day
- View habits scheduled for each date
- See daily completion progress
- Select a date to view its habits
- Complete or uncomplete habits directly from the calendar

### 📊 Progress Analytics

The Progress dashboard provides insights into habit consistency, including:

- Today's completion rate
- Weekly completion rate
- Current streak
- Weekly completed vs. scheduled habits
- Best-performing day
- Daily weekly progress
- Category performance

### 👤 User Profiles

Users can manage their Bloom Buddy identity through their profile.

Profile features include:

- Custom display name
- Profile avatar uploads
- Avatar removal and replacement
- Garden visibility preferences

### ⚙️ Settings & Preferences

Bloom Buddy supports customizable application preferences including:

- Light theme
- Dark theme
- System theme
- Week-start preference
- Garden privacy
- Persistent preferences between sessions

The application also automatically scrolls to the top when navigating between pages.

### 🔐 Authentication

User authentication and account management are handled through Supabase.

Protected application routes prevent unauthenticated users from accessing account-specific data.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

### Backend & Data

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage

### Development

- Git
- GitHub
- npm
- Visual Studio Code

---

## 🏗️ Project Architecture

Bloom Buddy uses a feature-based project structure to keep application functionality modular and maintainable.

```text
src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   └── router.tsx
│
├── components/
│   ├── auth/
│   ├── layout/
│   ├── navigation/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── calendar/
│   ├── habits/
│   ├── home/
│   ├── landing/
│   ├── plants/
│   ├── profile/
│   ├── progress/
│   └── settings/
│
├── assets/
│   └── plants/
│
├── lib/
│   └── supabase.ts
│
├── main.tsx
└── index.css

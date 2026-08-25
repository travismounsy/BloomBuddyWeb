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
```
### 🔄 Application Flow

```text

Authentication
      │
      ▼
   Home
      │
      ├── Today's Habits
      │        │
      │        ▼
      │   Habit Completion
      │        │
      │        ▼
      │   Plant Growth
      │
      ├── Habits
      │     └── Create / Schedule / Delete
      │
      ├── Calendar
      │     └── Daily & Monthly Activity
      │
      ├── Progress
      │     └── Analytics & Streaks
      │
      ├── Profile
      │     └── Avatar & Garden Identity
      │
      └── Settings
            └── Theme & Preferences
```

### 🌿 Habit Scheduling

Bloom Buddy supports multiple scheduling strategies.

Daily

The habit is scheduled every day within its active date range.

Weekly

Users select specific weekdays on which the habit should occur.

Example:
```text
 Monday
Wednesday
Friday
```
Monthly

Users select a specific day of the month.

Example:
```text
15th of every month
```
Scheduling logic determines which habits should appear on the Home, Habits, and Calendar pages for any selected date.

### 🌱 Plant Growth System
Bloom Buddy converts daily habit completion into visual plant growth.

The application calculates:
```text
Completed Habits
      ÷
Scheduled Habits
      │
      ▼
Completion Percentage
      │
      ▼
Plant Growth Stage
```
As completion increases, the user's plant advances through its growth stages.

The plant updates immediately when habit completion changes.

### 📊 Progress Tracking
Progress analytics are calculated using habit schedules and completion records.

Bloom Buddy evaluates:
```text
Habit Schedule
      +
Completion History
      │
      ▼
Daily Progress
Weekly Progress
Current Streak
Category Performance
Best Day
```
This allows analytics to reflect when a habit was actually scheduled rather than treating every habit as a daily requirement.

### 🎨 Responsive Design

Bloom Buddy is designed for desktop and mobile use.

The application includes:

- Responsive layouts
- Desktop sidebar navigation
- Mobile bottom navigation
- Light and dark themes
- Accessible form labels
- Loading and error states
- Immediate UI updates after habit completion

---

### 🚀 Getting Started
Prerequisites
Make sure the following are installed:
- Node.js
- npm
- Git

### Clone the Repository
```text
git clone <repository-url>
cd <repository-folder>
```

## Install Dependencies
```text
npm install
```

## Environment Variables

Create a .env file in the project root.

```text
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
Do not commit your .env file to source control.
## Start the Development Server
```text
npm run dev
```
Vite will provide the local development address in the terminal.

---

### 🧪 Testing
Bloom Buddy is tested across its primary user workflows, including:

- Registration and login
- Protected routes
- Habit creation
- Habit scheduling
- Habit deletion
- Habit completion
- Plant growth
- Calendar navigation
- Calendar completion tracking
- Progress analytics
- Avatar management
- Profile updates
- Theme switching
- Preference persistence
- Responsive navigation

A more detailed QA and testing document will be maintained separately as the project grows.

### 🗺️ Roadmap
## Completed

- Authentication
- Protected routes
- Habit management
- Habit scheduling
- Habit completion tracking
- Dynamic plant growth
- Calendar
- Progress analytics
- User profiles
- Avatar storage
- Garden privacy preferences
- Light / dark / system themes
- Persistent user preferences
- Responsive application navigation

## Planned

- Habit editing
- Expanded progress analytics
- Social Gardens
- User connections
- Shared garden visibility
- Additional plant customization
- Improved achievements and milestones
- Automated testing
- Accessibility improvements

### 💡 Project Background
Bloom Buddy originally began as an Android habit-tracking application.

The web version expands the original concept into a full-stack application while preserving its core idea: turning consistent habit completion into visible plant growth.

Rebuilding the application for the web also provided an opportunity to redesign its architecture around reusable React components, TypeScript, persistent cloud data, authentication, responsive layouts, and service-based application logic.

### License
This project is currently intended for educational and portfolio purposes.

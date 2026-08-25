# Bloom Buddy — Technical Design Document

## 1. Document Overview

### 1.1 Purpose

This document describes the technical design and architecture of the Bloom Buddy web application. It documents the application's major components, data flow, frontend architecture, backend integration, authentication, habit scheduling, completion tracking, plant growth system, progress analytics, and user preferences.

The purpose of this document is to provide a technical reference for understanding how Bloom Buddy is structured and how its major features interact.

### 1.2 Project Overview

Bloom Buddy is a full-stack habit tracking web application that encourages users to build consistent routines through visual progress.

Users create habits and assign schedules to them. As scheduled habits are completed, the application records completion history and converts daily progress into visual plant growth.

The application also provides calendar-based habit management, progress analytics, user profiles, avatar management, and application preferences.

---

# 2. Technology Stack

## 2.1 Frontend

Bloom Buddy uses:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

React provides the component-based user interface, while TypeScript provides static typing throughout the application.

Vite is used as the development and build environment.

Tailwind CSS provides responsive styling and theme support.

React Router manages public, authentication, and protected application routes.

## 2.2 Backend

Bloom Buddy uses Supabase for backend services.

Supabase provides:

- User authentication
- PostgreSQL database
- Data persistence
- Row-level user data access
- File storage for profile avatars

The frontend communicates with Supabase through service modules rather than directly from most UI components.

---

# 3. Application Architecture

## 3.1 Architectural Approach

Bloom Buddy uses a feature-based frontend architecture.

Application functionality is divided into independent feature directories rather than organizing the entire application strictly by file type.

Example:

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
│   ├── profile/
│   ├── progress/
│   └── settings/
│
├── assets/
├── lib/
├── main.tsx
└── index.css
```
# 4. Component Responsibilities
Bloom Buddy separates the application into several layers.

## Pages

Pages coordinate complete application screens.

Examples include:

- HomePage
- HabitsPage
- CalendarPage
- ProgressPage
- ProfilePage
- SettingsPage

Pages are primarily responsible for:

- Loading feature data
- Maintaining screen-level state
- Coordinating service calls
- Passing data to child components
- Handling loading and error states
- Components

Components provide reusable pieces of the user interface.

Examples include:

- HabitCard
- HabitForm
- SchedulePicker
- CalendarGrid
- BloomPlant
- PageHeader
- BottomNav

Components receive data through props and communicate changes through callbacks where appropriate.

Services

Service modules contain application and data-access logic.

Examples include:
```text
- habitService
- habitScheduleService
- habitCompletionService
- gardenService
- calendarService
- progressService
- profileService
- avatarService
- settingsService
```
Separating services from components reduces direct backend dependencies inside the UI.

# 5. Routing Architecture
Bloom Buddy uses React Router.

The application contains three primary routing areas:

Public Routes

Public pages are accessible without authentication.

Example:
/
Authentication Routes

Authentication pages are available to unauthenticated users.

Examples:
```bash
/login
/register
/forgot-password
```

A PublicOnlyRoute prevents authenticated users from unnecessarily returning to authentication screens.

Protected Routes

Authenticated application features are located beneath:
```bash
/app
```
Current protected routes include:
```bash
/app
/app/habits
/app/calendar
/app/progress
/app/profile
/app/settings
```
ProtectedRoute verifies authentication before allowing access to these routes.

AppLayout provides the common authenticated application shell, including navigation, header content, and the routed page outlet.

# 6. Habit Management System
Habits are the central domain object within Bloom Buddy.

A habit contains information such as:

- Title
- Description
- Category
- Color
- Start date
- Optional end date

Habit creation is handled through HabitForm.

The form creates the habit first and then creates its associated schedule.

Conceptually:
```bash
HabitForm
    │
    ▼
createHabit()
    │
    ▼
Habit Record
    │
    ▼
createHabitSchedules()
    │
    ▼
Schedule Record(s)
```
If schedule creation fails after the habit has been created, the application attempts to remove the newly created habit. This prevents an incomplete habit without the intended schedule from remaining in the system.

# 7. Habit Scheduling System

Habit scheduling is separated from the habit itself.

Bloom Buddy currently supports three schedule types:

Daily

The habit occurs every day while it is active.

Weekly

The user selects specific weekdays.

Example:
```bash
Monday
Wednesday
Friday
```
Monthly

The user selects a day of the month.

Example:
```bash
Day 15
```
SchedulePicker collects the scheduling configuration.

habitScheduleService handles schedule persistence and determines which habits apply to a particular date.

A central operation is:
```bash
filterHabitsForDate()
```
This allows the same scheduling logic to be reused by multiple features.
```text
                   Habit Data
                       │
                       ▼
Date ───────► filterHabitsForDate() ◄──── Schedule Data
                       │
                       ▼
               Habits Due on Date
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        Home        Habits       Calendar
```
This prevents each page from implementing its own interpretation of habit schedules.

# 8. Habit Completion System
Habit completions are stored independently from habits.

A completion associates a habit with a completion date.

Conceptually:
```text
Habit
  │
  ├──── Completion — 2026-08-22
  ├──── Completion — 2026-08-23
  └──── Completion — 2026-08-24
```
HabitCard provides the primary completion control.

When the user marks a habit complete:
```text
User
 │
 ▼
HabitCard
 │
 ▼
markHabitComplete()
 │
 ▼
Supabase
 │
 ▼
Completion returned
 │
 ▼
Parent page state updated
 │
 ▼
UI updates immediately
```
# 9. Garden Growth System
The virtual plant is Bloom Buddy's primary visual feedback mechanism.

The Home page gathers:

Habits
Habit schedules
Today's completions

These values are passed to the garden calculation service.
```text
Habits
   +
Schedules
   +
Today's Completions
   │
   ▼
getDailyGardenProgress()
   │
   ├── Scheduled Count
   ├── Completed Count
   ├── Completion Rate
   └── Growth Stage
             │
             ▼
         BloomPlant
```
The plant currently supports six visual stages:
```text
Empty
  ↓
Sprout
  ↓
Small
  ↓
Growing
  ↓
Blooming
  ↓
Full
```

BloomPlant maps the calculated growth stage to the appropriate plant image.

When the growth stage changes, the component transitions between plant images to provide immediate visual feedback.

This design separates growth calculation from plant presentation:
```text
gardenService = determines growth

BloomPlant = displays growth
```
When a completed habit is unchecked, unmarkHabitComplete() removes the corresponding completion.

The parent page receives the result through onCompletionChange.

This enables features such as the Home garden and Calendar completion indicators to update without requiring a complete page reload.

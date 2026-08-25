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

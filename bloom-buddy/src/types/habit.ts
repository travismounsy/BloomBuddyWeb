export type HabitCategory = 'Health' | 'School' | 'Self-care' | 'Productivity';

export type Habit = {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  createdAt: string;
};

export type HabitCompletion = {
  id: string;
  habitId: string;
  date: string;
};
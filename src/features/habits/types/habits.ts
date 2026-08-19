export type Habit = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  color: string | null;
  start_date: string;
  end_date: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateHabitInput = {
  title: string;
  description?: string;
  category?: string;
  color?: string;
  startDate: string;
  endDate?: string | null;
};

export type UpdateHabitInput = {
  title?: string;
  description?: string | null;
  category?: string | null;
  color?: string | null;
  startDate?: string;
  endDate?: string | null;
  isArchived?: boolean;
};

export type HabitScheduleType = "daily" | "weekly" | "monthly";

export type HabitSchedule = {
  id: string;
  habit_id: string;
  user_id: string;
  schedule_type: HabitScheduleType;
  day_of_week: number | null;
  day_of_month: number | null;
  created_at: string;
};

export type CreateHabitScheduleInput = {
  habitId: string;
  scheduleType: HabitScheduleType;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  user_id: string;
  completion_date: string;
  completed_at: string;
};
import { supabase } from "../../../lib/supabase";

import type {
  Habit,
  HabitSchedule,
  HabitScheduleType,
} from "../types/habits";

export async function getHabitSchedules(): Promise<HabitSchedule[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view habit schedules."
    );
  }

  const { data, error } = await supabase
    .from("habit_schedules")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data as HabitSchedule[];
}

export async function getSchedulesForHabit(
  habitId: string
): Promise<HabitSchedule[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view habit schedules."
    );
  }

  const { data, error } = await supabase
    .from("habit_schedules")
    .select("*")
    .eq("habit_id", habitId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data as HabitSchedule[];
}

export async function createHabitSchedules(
  habitId: string,
  scheduleType: HabitScheduleType,
  selectedDays: number[],
  dayOfMonth: number | null
): Promise<HabitSchedule[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to create habit schedules."
    );
  }

  let rows;

  if (scheduleType === "weekly") {
    if (selectedDays.length === 0) {
      throw new Error(
        "Select at least one day for a weekly habit."
      );
    }

    rows = selectedDays.map((day) => ({
      habit_id: habitId,
      user_id: user.id,
      schedule_type: "weekly",
      day_of_week: day,
      day_of_month: null,
    }));
  } else if (scheduleType === "monthly") {
    if (
      dayOfMonth === null ||
      dayOfMonth < 1 ||
      dayOfMonth > 31
    ) {
      throw new Error(
        "Choose a valid day of the month."
      );
    }

    rows = [
      {
        habit_id: habitId,
        user_id: user.id,
        schedule_type: "monthly",
        day_of_week: null,
        day_of_month: dayOfMonth,
      },
    ];
  } else {
    rows = [
      {
        habit_id: habitId,
        user_id: user.id,
        schedule_type: "daily",
        day_of_week: null,
        day_of_month: null,
      },
    ];
  }

  const { data, error } = await supabase
    .from("habit_schedules")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data as HabitSchedule[];
}

export function isHabitScheduledForDate(
  habit: Habit,
  schedules: HabitSchedule[],
  date: Date
): boolean {
  const dateKey = formatDateKey(date);

  if (dateKey < habit.start_date) {
    return false;
  }

  if (
    habit.end_date &&
    dateKey > habit.end_date
  ) {
    return false;
  }

  const habitSchedules = schedules.filter(
    (schedule) => schedule.habit_id === habit.id
  );

  if (habitSchedules.length === 0) {
    return false;
  }

  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();

  return habitSchedules.some((schedule) => {
    if (schedule.schedule_type === "daily") {
      return true;
    }

    if (schedule.schedule_type === "weekly") {
      return schedule.day_of_week === dayOfWeek;
    }

    if (schedule.schedule_type === "monthly") {
      return schedule.day_of_month === dayOfMonth;
    }

    return false;
  });
}

export function filterHabitsForDate(
  habits: Habit[],
  schedules: HabitSchedule[],
  date: Date
): Habit[] {
  return habits.filter((habit) =>
    isHabitScheduledForDate(
      habit,
      schedules,
      date
    )
  );
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
import { supabase } from "../../../lib/supabase";

import type {
  Habit,
  HabitCompletion,
  HabitSchedule,
} from "../../habits/types/habits";

import {
  filterHabitsForDate,
} from "../../habits/services/habitScheduleService";

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStartOfWeek(date: Date) {
  const result = new Date(date);

  const day = result.getDay();

  result.setDate(
    result.getDate() - day
  );

  result.setHours(0, 0, 0, 0);

  return result;
}

function getEndOfWeek(date: Date) {
  const result = getStartOfWeek(date);

  result.setDate(
    result.getDate() + 6
  );

  result.setHours(23, 59, 59, 999);

  return result;
}

export async function getCompletionsForRange(
  startDate: string,
  endDate: string
): Promise<HabitCompletion[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(
      "You must be signed in to view progress."
    );
  }

  const { data, error } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("user_id", user.id)
    .gte("completion_date", startDate)
    .lte("completion_date", endDate);

  if (error) {
    throw new Error(error.message);
  }

  return data as HabitCompletion[];
}

export function calculateCompletionRate(
  habits: Habit[],
  schedules: HabitSchedule[],
  completions: HabitCompletion[],
  date: Date
): number {
  const habitsForDate =
    filterHabitsForDate(
      habits,
      schedules,
      date
    );

  if (habitsForDate.length === 0) {
    return 0;
  }

  const dateKey =
    getLocalDateKey(date);

  const completedHabitIds =
    new Set(
      completions
        .filter(
          (completion) =>
            completion.completion_date === dateKey
        )
        .map(
          (completion) =>
            completion.habit_id
        )
    );

  const completedCount =
    habitsForDate.filter(
      (habit) =>
        completedHabitIds.has(habit.id)
    ).length;

  return Math.round(
    (completedCount / habitsForDate.length) * 100
  );
}

export function calculateWeeklyCompletionRate(
  habits: Habit[],
  schedules: HabitSchedule[],
  completions: HabitCompletion[],
  referenceDate: Date
): number {
  const startOfWeek =
    getStartOfWeek(referenceDate);

  let scheduledCount = 0;
  let completedCount = 0;

  for (
    let offset = 0;
    offset < 7;
    offset += 1
  ) {
    const date =
      new Date(startOfWeek);

    date.setDate(
      startOfWeek.getDate() + offset
    );

    const habitsForDate =
      filterHabitsForDate(
        habits,
        schedules,
        date
      );

    scheduledCount +=
      habitsForDate.length;

    const dateKey =
      getLocalDateKey(date);

    const completedHabitIds =
      new Set(
        completions
          .filter(
            (completion) =>
              completion.completion_date ===
              dateKey
          )
          .map(
            (completion) =>
              completion.habit_id
          )
      );

    completedCount +=
      habitsForDate.filter(
        (habit) =>
          completedHabitIds.has(
            habit.id
          )
      ).length;
  }

  if (scheduledCount === 0) {
    return 0;
  }

  return Math.round(
    (completedCount / scheduledCount) * 100
  );
}

export function calculateCurrentStreak(
  habits: Habit[],
  schedules: HabitSchedule[],
  completions: HabitCompletion[],
  referenceDate: Date
): number {
  let streak = 0;

  const date =
    new Date(referenceDate);

  for (
    let offset = 0;
    offset < 365;
    offset += 1
  ) {
    const habitsForDate =
      filterHabitsForDate(
        habits,
        schedules,
        date
      );

    if (habitsForDate.length === 0) {
      date.setDate(
        date.getDate() - 1
      );

      continue;
    }

    const dateKey =
      getLocalDateKey(date);

    const completedHabitIds =
      new Set(
        completions
          .filter(
            (completion) =>
              completion.completion_date ===
              dateKey
          )
          .map(
            (completion) =>
              completion.habit_id
          )
      );

    const allCompleted =
      habitsForDate.every(
        (habit) =>
          completedHabitIds.has(
            habit.id
          )
      );

    if (!allCompleted) {
      break;
    }

    streak += 1;

    date.setDate(
      date.getDate() - 1
    );
  }

  return streak;
}

export function getCurrentWeekRange(
  referenceDate: Date
) {
  return {
    startDate:
      getLocalDateKey(
        getStartOfWeek(referenceDate)
      ),

    endDate:
      getLocalDateKey(
        getEndOfWeek(referenceDate)
      ),
  };
}

export function getRecentRange(
  referenceDate: Date,
  daysBack: number
) {
  const endDate = new Date(referenceDate);

  const startDate = new Date(referenceDate);
  startDate.setDate(
    startDate.getDate() - daysBack
  );

  return {
    startDate: getLocalDateKey(startDate),
    endDate: getLocalDateKey(endDate),
  };
}

export type DailyProgress = {
  date: string;
  label: string;
  completionRate: number;
};

export function getWeeklyDailyProgress(
  habits: Habit[],
  schedules: HabitSchedule[],
  completions: HabitCompletion[],
  referenceDate: Date
): DailyProgress[] {
  const startOfWeek =
    getStartOfWeek(referenceDate);

  const results: DailyProgress[] = [];

  for (
    let offset = 0;
    offset < 7;
    offset += 1
  ) {
    const date =
      new Date(startOfWeek);

    date.setDate(
      startOfWeek.getDate() + offset
    );

    results.push({
      date: getLocalDateKey(date),
      label: date.toLocaleDateString(
        undefined,
        {
          weekday: "short",
        }
      ),
      completionRate:
        calculateCompletionRate(
          habits,
          schedules,
          completions,
          date
        ),
    });
  }

  return results;
}

export type CategoryProgress = {
  category: string;
  scheduledCount: number;
  completedCount: number;
  completionRate: number;
};

export function getWeeklyCategoryProgress(
  habits: Habit[],
  schedules: HabitSchedule[],
  completions: HabitCompletion[],
  referenceDate: Date
): CategoryProgress[] {
  const startOfWeek =
    getStartOfWeek(referenceDate);

  const categoryMap =
    new Map<
      string,
      {
        scheduledCount: number;
        completedCount: number;
      }
    >();

  for (
    let offset = 0;
    offset < 7;
    offset += 1
  ) {
    const date =
      new Date(startOfWeek);

    date.setDate(
      startOfWeek.getDate() + offset
    );

    const dateKey =
      getLocalDateKey(date);

    const habitsForDate =
      filterHabitsForDate(
        habits,
        schedules,
        date
      );

    const completedHabitIds =
      new Set(
        completions
          .filter(
            (completion) =>
              completion.completion_date ===
              dateKey
          )
          .map(
            (completion) =>
              completion.habit_id
          )
      );

    habitsForDate.forEach((habit) => {
      const category =
        habit.category?.trim() ||
        "Uncategorized";

      const current =
        categoryMap.get(category) ?? {
          scheduledCount: 0,
          completedCount: 0,
        };

      current.scheduledCount += 1;

      if (
        completedHabitIds.has(
          habit.id
        )
      ) {
        current.completedCount += 1;
      }

      categoryMap.set(
        category,
        current
      );
    });
  }

  return Array.from(
    categoryMap.entries()
  )
    .map(
      ([
        category,
        {
          scheduledCount,
          completedCount,
        },
      ]) => ({
        category,
        scheduledCount,
        completedCount,
        completionRate:
          scheduledCount === 0
            ? 0
            : Math.round(
                (
                  completedCount /
                  scheduledCount
                ) * 100
              ),
      })
    )
    .sort(
      (a, b) =>
        b.completionRate -
        a.completionRate
    );
}
export type WeeklySummary = {
  scheduledCount: number;
  completedCount: number;
  bestDayLabel: string | null;
  bestDayRate: number;
};

export function getWeeklySummary(
  habits: Habit[],
  schedules: HabitSchedule[],
  completions: HabitCompletion[],
  referenceDate: Date
): WeeklySummary {
  const startOfWeek =
    getStartOfWeek(referenceDate);

  let scheduledCount = 0;
  let completedCount = 0;

  let bestDayLabel: string | null = null;
  let bestDayRate = 0;

  for (
    let offset = 0;
    offset < 7;
    offset += 1
  ) {
    const date = new Date(startOfWeek);

    date.setDate(
      startOfWeek.getDate() + offset
    );

    const habitsForDate =
      filterHabitsForDate(
        habits,
        schedules,
        date
      );

    const dateKey =
      getLocalDateKey(date);

    const completedHabitIds =
      new Set(
        completions
          .filter(
            (completion) =>
              completion.completion_date ===
              dateKey
          )
          .map(
            (completion) =>
              completion.habit_id
          )
      );

    const completedForDay =
      habitsForDate.filter(
        (habit) =>
          completedHabitIds.has(
            habit.id
          )
      ).length;

    scheduledCount +=
      habitsForDate.length;

    completedCount +=
      completedForDay;

    if (habitsForDate.length > 0) {
      const dailyRate =
        Math.round(
          (
            completedForDay /
            habitsForDate.length
          ) * 100
        );

      if (
        bestDayLabel === null ||
        dailyRate > bestDayRate
      ) {
        bestDayRate = dailyRate;

        bestDayLabel =
          date.toLocaleDateString(
            undefined,
            {
              weekday: "long",
            }
          );
      }
    }
  }

  return {
    scheduledCount,
    completedCount,
    bestDayLabel,
    bestDayRate,
  };
}
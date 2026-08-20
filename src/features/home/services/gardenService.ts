import type {
  Habit,
  HabitCompletion,
  HabitSchedule,
} from "../../habits/types/habits";

import {
  filterHabitsForDate,
} from "../../habits/services/habitScheduleService";

import type {
  DailyGardenProgress,
  PlantGrowthStage,
} from "../types/garden";

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getPlantGrowthStage(
  completionRate: number
): PlantGrowthStage {
  if (completionRate <= 0) {
    return "empty";
  }

  if (completionRate <= 25) {
    return "sprout";
  }

  if (completionRate <= 50) {
    return "small";
  }

  if (completionRate <= 75) {
    return "growing";
  }

  if (completionRate < 100) {
    return "blooming";
  }

  return "full";
}

export function getDailyGardenProgress(
  habits: Habit[],
  schedules: HabitSchedule[],
  completions: HabitCompletion[],
  date: Date
): DailyGardenProgress {
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

  const completedCount =
    habitsForDate.filter(
      (habit) =>
        completedHabitIds.has(
          habit.id
        )
    ).length;

  const scheduledCount =
    habitsForDate.length;

  const completionRate =
    scheduledCount === 0
      ? 0
      : Math.round(
          (
            completedCount /
            scheduledCount
          ) * 100
        );

  return {
    scheduledCount,
    completedCount,
    completionRate,
    growthStage:
      getPlantGrowthStage(
        completionRate
      ),
  };
}
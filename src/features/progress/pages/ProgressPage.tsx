import { useEffect, useState } from "react";

import {
  Award,
  CalendarCheck2,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";

import PageHeader from "../../../components/ui/PageHeader";

import {
  getHabits,
} from "../../habits/services/habitService";

import {
  getHabitSchedules,
} from "../../habits/services/habitScheduleService";

import type {
  Habit,
  HabitCompletion,
  HabitSchedule,
} from "../../habits/types/habits";

import {
  calculateCompletionRate,
  calculateCurrentStreak,
  calculateWeeklyCompletionRate,
  getCompletionsForRange,
  getCurrentWeekRange,
  getRecentRange,
  getWeeklyCategoryProgress,
  getWeeklyDailyProgress,
  getWeeklySummary,
} from "../services/progressService";

export default function ProgressPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const [schedules, setSchedules] =
    useState<HabitSchedule[]>([]);

  const [
    weeklyCompletions,
    setWeeklyCompletions,
  ] = useState<HabitCompletion[]>([]);

  const [
    streakCompletions,
    setStreakCompletions,
  ] = useState<HabitCompletion[]>([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function loadProgressData() {
      try {
        setErrorMessage("");

        const today = new Date();

        const {
          startDate: weekStart,
          endDate: weekEnd,
        } = getCurrentWeekRange(today);

        const {
          startDate: streakStart,
          endDate: streakEnd,
        } = getRecentRange(
          today,
          90
        );

        const [
          habitData,
          scheduleData,
          weeklyCompletionData,
          streakCompletionData,
        ] = await Promise.all([
          getHabits(),
          getHabitSchedules(),

          getCompletionsForRange(
            weekStart,
            weekEnd
          ),

          getCompletionsForRange(
            streakStart,
            streakEnd
          ),
        ]);

        setHabits(habitData);

        setSchedules(
          scheduleData
        );

        setWeeklyCompletions(
          weeklyCompletionData
        );

        setStreakCompletions(
          streakCompletionData
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load progress data."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProgressData();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Insights"
          title="Progress"
          description="Review your streaks, completion rates, and category performance."
        />

        <section className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <p className="text-slate-600">
            Loading progress...
          </p>
        </section>
      </>
    );
  }

  const today = new Date();

  const todayCompletionRate =
    calculateCompletionRate(
      habits,
      schedules,
      weeklyCompletions,
      today
    );

  const weeklyCompletionRate =
    calculateWeeklyCompletionRate(
      habits,
      schedules,
      weeklyCompletions,
      today
    );

  const currentStreak =
    calculateCurrentStreak(
      habits,
      schedules,
      streakCompletions,
      today
    );

  const weeklyDailyProgress =
    getWeeklyDailyProgress(
      habits,
      schedules,
      weeklyCompletions,
      today
    );

  const categoryProgress =
    getWeeklyCategoryProgress(
      habits,
      schedules,
      weeklyCompletions,
      today
    );

  const weeklySummary =
    getWeeklySummary(
      habits,
      schedules,
      weeklyCompletions,
      today
    );

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Progress"
        description="Review your streaks, completion rates, and category performance."
      />

      {errorMessage && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {/* Primary metrics */}
      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Today
              </p>

              <p className="mt-3 text-4xl font-bold text-emerald-900">
                {todayCompletionRate}%
              </p>

              <p className="mt-2 text-sm text-slate-600">
                completion rate
              </p>
            </div>

            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
              <Target
                size={22}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${todayCompletionRate}%`,
              }}
            />
          </div>
        </article>

        <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                This Week
              </p>

              <p className="mt-3 text-4xl font-bold text-emerald-900">
                {weeklyCompletionRate}%
              </p>

              <p className="mt-2 text-sm text-slate-600">
                completion rate
              </p>
            </div>

            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
              <TrendingUp
                size={22}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${weeklyCompletionRate}%`,
              }}
            />
          </div>
        </article>

        <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Current Streak
              </p>

              <p className="mt-3 text-4xl font-bold text-emerald-900">
                {currentStreak}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {currentStreak === 1
                  ? "day"
                  : "days"}
              </p>
            </div>

            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-700">
              <Flame
                size={22}
                aria-hidden="true"
              />
            </div>
          </div>
        </article>
      </section>

      {/* Secondary metrics */}
      <section className="mt-6 grid gap-5 md:grid-cols-2">
        <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Weekly Completions
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-900">
                {weeklySummary.completedCount}

                <span className="text-lg font-medium text-slate-400">
                  {" "}
                  / {weeklySummary.scheduledCount}
                </span>
              </p>

              <p className="mt-2 text-sm text-slate-600">
                scheduled habits completed this week
              </p>
            </div>

            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800">
              <CalendarCheck2
                size={22}
                aria-hidden="true"
              />
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Best Day
              </p>

              {weeklySummary.bestDayLabel ? (
                <>
                  <p className="mt-3 text-3xl font-bold text-emerald-900">
                    {weeklySummary.bestDayLabel}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {weeklySummary.bestDayRate}% completion
                  </p>
                </>
              ) : (
                <p className="mt-3 text-slate-600">
                  No scheduled habits this week.
                </p>
              )}
            </div>

            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime-100 text-lime-800">
              <Award
                size={22}
                aria-hidden="true"
              />
            </div>
          </div>
        </article>
      </section>

      {/* Weekly chart */}
      <section className="mt-6 rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Weekly Progress
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Completion by Day
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-7 gap-3">
          {weeklyDailyProgress.map((day) => (
            <div
              key={day.date}
              className="flex min-w-0 flex-col items-center"
            >
              <div className="flex h-44 w-full items-end justify-center rounded-xl bg-slate-50 px-2 py-3">
                <div
                  className="w-full max-w-10 rounded-t-lg bg-emerald-500 transition-all"
                  style={{
                    height: `${Math.max(
                      day.completionRate,
                      4
                    )}%`,
                  }}
                  title={`${day.completionRate}% complete`}
                />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                {day.label}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {day.completionRate}%
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Category performance */}
      <section className="mt-6 rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Categories
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Category Performance
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            See how consistently you completed habits in each category this week.
          </p>
        </div>

        {categoryProgress.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-slate-600">
              No category progress available for this week.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {categoryProgress.map(
              (category) => (
                <div
                  key={category.category}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {category.category}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {category.completedCount}
                        {" / "}
                        {category.scheduledCount}
                        {" completed"}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-emerald-800">
                      {category.completionRate}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${category.completionRate}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </>
  );
}
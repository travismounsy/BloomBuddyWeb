import { useEffect, useState } from "react";

import PageHeader from "../../../components/ui/PageHeader";

import {
  getHabits,
} from "../../habits/services/habitService";

import {
  getHabitSchedules,
  filterHabitsForDate,
} from "../../habits/services/habitScheduleService";

import {
  getCompletionsForDate,
} from "../../habits/services/habitCompletionService";

import HabitCard from "../../habits/components/HabitCard";

import {
  getCurrentProfile,
} from "../../profile/services/profileService";

import type {
  Profile,
} from "../../profile/services/profileService";

import BloomPlant from "../components/BloomPlant";

import {
  getDailyGardenProgress,
} from "../services/gardenService";

import type {
  Habit,
  HabitCompletion,
  HabitSchedule,
} from "../../habits/types/habits";

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

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default function HomePage() {
  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [schedules, setSchedules] =
    useState<HabitSchedule[]>([]);

  const [completions, setCompletions] =
    useState<HabitCompletion[]>([]);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const today = new Date();
  const todayKey = getLocalDateKey(today);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setErrorMessage("");

        const [
          habitData,
          scheduleData,
          completionData,
          profileData,
        ] = await Promise.all([
          getHabits(),
          getHabitSchedules(),
          getCompletionsForDate(
            todayKey
          ),
          getCurrentProfile(),
        ]);

        setHabits(habitData);

        setSchedules(
          scheduleData
        );

        setCompletions(
          completionData
        );

        setProfile(
          profileData
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your Bloom Buddy."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadHomeData();
  }, [todayKey]);

  function handleCompletionChange(
    habitId: string,
    completion: HabitCompletion | null
  ) {
    setCompletions(
      (currentCompletions) => {
        const remaining =
          currentCompletions.filter(
            (item) =>
              item.habit_id !== habitId
          );

        if (!completion) {
          return remaining;
        }

        return [
          ...remaining,
          completion,
        ];
      }
    );
  }

  const habitsDueToday =
    filterHabitsForDate(
      habits,
      schedules,
      today
    );

  const gardenProgress =
    getDailyGardenProgress(
      habits,
      schedules,
      completions,
      today
    );

  const habitsRemaining =
    gardenProgress.scheduledCount -
    gardenProgress.completedCount;

  const greetingTitle =
    profile?.display_name
      ? `${getGreeting()}, ${profile.display_name}`
      : getGreeting();

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Home"
          title="Bloom Buddy"
          description="Complete today's habits and help your plant grow."
        />

        <section className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <p className="text-slate-600">
            Loading your garden...
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Home"
        title={greetingTitle}
        description="Complete today's habits and help your Bloom Buddy grow."
      />

      {errorMessage && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)]">
        <BloomPlant
          stage={
            gardenProgress.growthStage
          }
          completionRate={
            gardenProgress.completionRate
          }
        />

        <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Today
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Daily Progress
          </h2>

          <p className="mt-5 text-4xl font-bold text-emerald-900">
            {
              gardenProgress.completedCount
            }

            <span className="text-lg font-medium text-slate-400">
              {" "}
              /{" "}
              {
                gardenProgress.scheduledCount
              }
            </span>
          </p>

          <p className="mt-2 text-sm text-slate-600">
            habits completed today
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${gardenProgress.completionRate}%`,
              }}
            />
          </div>

          <div className="mt-6 rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">
              {gardenProgress.scheduledCount === 0
                ? "You have no habits scheduled today."
                : gardenProgress.completedCount ===
                    gardenProgress.scheduledCount
                  ? "Everything is complete. Your Bloom Buddy is thriving!"
                  : `${habitsRemaining} ${
                      habitsRemaining === 1
                        ? "habit"
                        : "habits"
                    } left today.`}
            </p>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Today's Routine
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Habits for Today
            </h2>
          </div>

          <span className="text-sm text-slate-500">
            {habitsDueToday.length}{" "}
            {habitsDueToday.length === 1
              ? "habit"
              : "habits"}
          </span>
        </div>

        {habitsDueToday.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-medium text-slate-700">
              Nothing scheduled today.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Enjoy the break or add a new habit from the Habits page.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {habitsDueToday.map(
              (habit) => {
                const completion =
                  completions.find(
                    (item) =>
                      item.habit_id ===
                      habit.id
                  ) ?? null;

                return (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completion={
                      completion
                    }
                    date={todayKey}
                    onCompletionChange={
                      handleCompletionChange
                    }
                  />
                );
              }
            )}
          </div>
        )}
      </section>
    </>
  );
}
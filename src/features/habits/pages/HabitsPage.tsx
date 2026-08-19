import { useEffect, useState } from "react";

import {
  deleteHabit,
  getHabits,
} from "../services/habitService";

import {
  getCompletionsForDate,
} from "../services/habitCompletionService";

import {
  filterHabitsForDate,
  getHabitSchedules,
} from "../services/habitScheduleService";

import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";

import type {
  Habit,
  HabitCompletion,
  HabitSchedule,
} from "../types/habits";

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

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [schedules, setSchedules] = useState<HabitSchedule[]>([]);
  const [completions, setCompletions] =
    useState<HabitCompletion[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    getLocalDateKey(new Date())
  );

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedDateObject = new Date(
    `${selectedDate}T00:00:00`
  );

  useEffect(() => {
    async function loadHabitData() {
      try {
        setLoading(true);
        setErrorMessage("");

        const [
          habitData,
          scheduleData,
          completionData,
        ] = await Promise.all([
          getHabits(),
          getHabitSchedules(),
          getCompletionsForDate(selectedDate),
        ]);

        setHabits(habitData);
        setSchedules(scheduleData);
        setCompletions(completionData);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load your habits."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadHabitData();
  }, [selectedDate]);

  function handleCompletionChange(
    habitId: string,
    completion: HabitCompletion | null
  ) {
    setCompletions((currentCompletions) => {
      const remaining =
        currentCompletions.filter(
          (item) => item.habit_id !== habitId
        );

      if (!completion) {
        return remaining;
      }

      return [
        ...remaining,
        completion,
      ];
    });
  }

  async function handleDeleteHabit(
    habitId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this habit?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(habitId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteHabit(habitId);

      setHabits((currentHabits) =>
        currentHabits.filter(
          (habit) => habit.id !== habitId
        )
      );

      setSchedules((currentSchedules) =>
        currentSchedules.filter(
          (schedule) =>
            schedule.habit_id !== habitId
        )
      );

      setCompletions((currentCompletions) =>
        currentCompletions.filter(
          (completion) =>
            completion.habit_id !== habitId
        )
      );

      setSuccessMessage("Habit deleted.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete your habit."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const habitsDueForSelectedDate =
    filterHabitsForDate(
      habits,
      schedules,
      selectedDateObject
    );

  if (loading) {
    return (
      <section>
        <p className="text-slate-600">
          Loading habits...
        </p>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
          Habits
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Build Your Habits
        </h1>

        <p className="mt-2 text-slate-600">
          Create and manage the routines that help your
          Bloom Buddy grow.
        </p>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="mt-6 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
        <HabitForm
          onHabitCreated={(habit, newSchedules) => {
            setHabits((currentHabits) => [
              habit,
              ...currentHabits,
            ]);

            setSchedules((currentSchedules) => [
              ...currentSchedules,
              ...newSchedules,
            ]);

            setSuccessMessage(
              "Habit created successfully."
            );
          }}
        />

        <div>
          {/* Date selector */}
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <label
                htmlFor="selectedDate"
                className="block text-sm font-medium text-slate-900"
              >
                View habits for
              </label>

              <input
                id="selectedDate"
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value
                  )
                }
                className="mt-2 rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedDate(
                  getLocalDateKey(new Date())
                )
              }
              className="rounded-lg border border-green-600 px-4 py-2 font-medium text-green-700 transition hover:bg-green-50"
            >
              Today
            </button>
          </div>

          {/* Habit count */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Scheduled Habits
            </h2>

            <span className="text-sm text-slate-500">
              {habitsDueForSelectedDate.length}{" "}
              {habitsDueForSelectedDate.length === 1
                ? "habit"
                : "habits"}
            </span>
          </div>

          {/* Habit list */}
          {habitsDueForSelectedDate.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-medium text-slate-700">
                No habits scheduled for this date.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Choose another date or create a new habit.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {habitsDueForSelectedDate.map(
                (habit) => {
                  const completion =
                    completions.find(
                      (item) =>
                        item.habit_id === habit.id
                    ) ?? null;

                  return (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      completion={completion}
                      date={selectedDate}
                      onCompletionChange={
                        handleCompletionChange
                      }
                      onDelete={handleDeleteHabit}
                      deleting={
                        deletingId === habit.id
                      }
                    />
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
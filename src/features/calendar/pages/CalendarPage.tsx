import { useEffect, useMemo, useState } from "react";

import {
  getHabits,
} from "../../habits/services/habitService";

import {
  filterHabitsForDate,
  getHabitSchedules,
} from "../../habits/services/habitScheduleService";

import {
  getCompletionsForDate,
} from "../../habits/services/habitCompletionService";

import {
  getCompletionsForRange,
} from "../services/calendarService";

import type {
  Habit,
  HabitCompletion,
  HabitSchedule,
} from "../../habits/types/habits";

import HabitCard from "../../habits/components/HabitCard";
import CalendarGrid from "../components/CalendarGrid";

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

function getMonthRange(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(
    year,
    month,
    1
  );

  const lastDay = new Date(
    year,
    month + 1,
    0
  );

  return {
    startDate: getLocalDateKey(firstDay),
    endDate: getLocalDateKey(lastDay),
  };
}

export default function CalendarPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const [schedules, setSchedules] =
    useState<HabitSchedule[]>([]);

  const [
    selectedDateCompletions,
    setSelectedDateCompletions,
  ] = useState<HabitCompletion[]>([]);

  const [
    monthCompletions,
    setMonthCompletions,
  ] = useState<HabitCompletion[]>([]);

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date()
  );

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [loading, setLoading] = useState(true);

  const [
    loadingSelectedDate,
    setLoadingSelectedDate,
  ] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // Load habits and schedules
  useEffect(() => {
    async function loadCalendarData() {
      try {
        setErrorMessage("");

        const [
          habitData,
          scheduleData,
        ] = await Promise.all([
          getHabits(),
          getHabitSchedules(),
        ]);

        setHabits(habitData);
        setSchedules(scheduleData);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load calendar data."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCalendarData();
  }, []);

  // Load completion data for the visible month
  useEffect(() => {
    async function loadMonthCompletions() {
      try {
        const {
          startDate,
          endDate,
        } = getMonthRange(currentMonth);

        const completionData =
          await getCompletionsForRange(
            startDate,
            endDate
          );

        setMonthCompletions(
          completionData
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load monthly progress."
        );
      }
    }

    void loadMonthCompletions();
  }, [currentMonth]);

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString(
        undefined,
        {
          month: "long",
          year: "numeric",
        }
      ),
    [currentMonth]
  );

  function goToPreviousMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );

    setSelectedDate(null);
    setSelectedDateCompletions([]);
  }

  function goToNextMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );

    setSelectedDate(null);
    setSelectedDateCompletions([]);
  }

  function goToToday() {
    const today = new Date();

    setCurrentMonth(today);

    void handleDateSelect(today);
  }

  function getHabitsForDate(
    date: Date
  ) {
    return filterHabitsForDate(
      habits,
      schedules,
      date
    );
  }

  async function handleDateSelect(
    date: Date
  ) {
    setSelectedDate(date);
    setLoadingSelectedDate(true);
    setErrorMessage("");

    try {
      const completionData =
        await getCompletionsForDate(
          getLocalDateKey(date)
        );

      setSelectedDateCompletions(
        completionData
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load this date."
      );
    } finally {
      setLoadingSelectedDate(false);
    }
  }

  function handleCompletionChange(
    habitId: string,
    completion: HabitCompletion | null
  ) {
    if (!selectedDate) {
      return;
    }

    const selectedDateKey =
      getLocalDateKey(selectedDate);

    function updateCompletionList(
      currentCompletions: HabitCompletion[]
    ) {
      const remaining =
        currentCompletions.filter(
          (item) =>
            !(
              item.habit_id === habitId &&
              item.completion_date ===
                selectedDateKey
            )
        );

      if (!completion) {
        return remaining;
      }

      return [
        ...remaining,
        completion,
      ];
    }

    setSelectedDateCompletions(
      updateCompletionList
    );

    setMonthCompletions(
      updateCompletionList
    );
  }

  const selectedHabits =
    selectedDate
      ? getHabitsForDate(
          selectedDate
        )
      : [];

  if (loading) {
    return (
      <section>
        <p className="text-slate-600">
          Loading calendar...
        </p>
      </section>
    );
  }

  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
          Calendar
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Monthly Schedule
        </h1>

        <p className="mt-2 text-slate-600">
          See which habits are scheduled throughout the month.
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

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            {monthLabel}
          </h2>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              Today
            </button>

            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>

        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          getHabitsForDate={getHabitsForDate}
          completions={monthCompletions}
          onDateSelect={handleDateSelect}
        />

        {selectedDate && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Selected Date
                </p>

                <h3 className="mt-1 text-xl font-semibold text-slate-900">
                  {selectedDate.toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedDateCompletions([]);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {loadingSelectedDate ? (
              <p className="mt-5 text-slate-600">
                Loading habits...
              </p>
            ) : selectedHabits.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                <p className="text-slate-600">
                  No habits scheduled for this date.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {selectedHabits.map(
                  (habit) => {
                    const completion =
                      selectedDateCompletions.find(
                        (item) =>
                          item.habit_id ===
                          habit.id
                      ) ?? null;

                    return (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        completion={completion}
                        date={getLocalDateKey(
                          selectedDate
                        )}
                        onCompletionChange={
                          handleCompletionChange
                        }
                      />
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
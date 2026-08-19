import { useState } from "react";
import type { SyntheticEvent } from "react";

import {
  createHabit,
  deleteHabit,
} from "../services/habitService";

import { createHabitSchedules } from "../services/habitScheduleService";

import SchedulePicker from "./SchedulePicker";

import type {
  Habit,
  HabitSchedule,
  HabitScheduleType,
} from "../types/habits";

type HabitFormProps = {
  onHabitCreated: (
    habit: Habit,
    schedules: HabitSchedule[]
  ) => void;
};

export default function HabitForm({
  onHabitCreated,
}: HabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#16a34a");

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [endDate, setEndDate] = useState("");

  const [scheduleType, setScheduleType] =
    useState<HabitScheduleType>("daily");

  const [selectedDays, setSelectedDays] =
    useState<number[]>([]);

  const [dayOfMonth, setDayOfMonth] =
    useState<number | null>(null);

  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>
  ) {
    event.preventDefault();

    setCreating(true);
    setErrorMessage("");

    if (endDate && endDate < startDate) {
      setErrorMessage(
        "End date cannot be before the start date."
      );
      setCreating(false);
      return;
    }

    let newHabit: Habit | null = null;

    try {
      newHabit = await createHabit({
        title,
        description,
        category,
        color,
        startDate,
        endDate: endDate || null,
      });

      const newSchedules = await createHabitSchedules(
            newHabit.id,
            scheduleType,
            selectedDays,
            dayOfMonth
        );

        onHabitCreated(
            newHabit,
            newSchedules
        );

      setTitle("");
      setDescription("");
      setCategory("");
      setColor("#16a34a");
      setStartDate(
        new Date().toISOString().split("T")[0]
      );
      setEndDate("");
      setScheduleType("daily");
      setSelectedDays([]);
      setDayOfMonth(null);
    } catch (error) {
      if (newHabit) {
        try {
          await deleteHabit(newHabit.id);
        } catch (cleanupError) {
          console.error(
            "Failed to clean up habit after schedule creation failed:",
            cleanupError
          );
        }
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your habit."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <h2 className="text-xl font-semibold text-slate-900">
        Create Habit
      </h2>

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <div className="mt-5">
        <label
          htmlFor="habitTitle"
          className="block font-medium text-slate-900"
        >
          Habit name
        </label>

        <input
          id="habitTitle"
          type="text"
          required
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Drink water"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="habitDescription"
          className="block font-medium text-slate-900"
        >
          Description
        </label>

        <textarea
          id="habitDescription"
          rows={3}
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Optional description"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="habitCategory"
          className="block font-medium text-slate-900"
        >
          Category
        </label>

        <input
          id="habitCategory"
          type="text"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          placeholder="Health"
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="habitStartDate"
            className="block font-medium text-slate-900"
          >
            Start date
          </label>

          <input
            id="habitStartDate"
            type="date"
            required
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="habitEndDate"
            className="block font-medium text-slate-900"
          >
            End date
          </label>

          <input
            id="habitEndDate"
            type="date"
            min={startDate}
            value={endDate}
            onChange={(event) =>
              setEndDate(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="habitColor"
          className="block font-medium text-slate-900"
        >
          Color
        </label>

        <input
          id="habitColor"
          type="color"
          value={color}
          onChange={(event) =>
            setColor(event.target.value)
          }
          className="mt-2 h-12 w-full cursor-pointer rounded-lg border border-slate-300 p-1"
        />
      </div>

      <div className="mt-6">
        <SchedulePicker
          scheduleType={scheduleType}
          selectedDays={selectedDays}
          dayOfMonth={dayOfMonth}
          onScheduleTypeChange={setScheduleType}
          onSelectedDaysChange={setSelectedDays}
          onDayOfMonthChange={setDayOfMonth}
        />
      </div>

      <button
        type="submit"
        disabled={creating}
        className="mt-6 w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creating ? "Creating..." : "Create Habit"}
      </button>
    </form>
  );
}
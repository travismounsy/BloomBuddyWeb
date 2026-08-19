import { useState } from "react";

import type {
  Habit,
  HabitCompletion,
} from "../types/habits";

import {
  markHabitComplete,
  unmarkHabitComplete,
} from "../services/habitCompletionService";

type HabitCardProps = {
  habit: Habit;
  completion: HabitCompletion | null;
  date: string;
  onCompletionChange: (
    habitId: string,
    completion: HabitCompletion | null
  ) => void;
  onDelete: (habitId: string) => void;
  deleting?: boolean;
};

export default function HabitCard({
  habit,
  completion,
  date,
  onCompletionChange,
  onDelete,
  deleting = false,
}: HabitCardProps) {
  const [updatingCompletion, setUpdatingCompletion] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const isComplete = Boolean(completion);

  async function handleCompletionToggle() {
    setUpdatingCompletion(true);
    setErrorMessage("");

    try {
      if (isComplete) {
        await unmarkHabitComplete(habit.id, date);

        onCompletionChange(habit.id, null);
      } else {
        const newCompletion = await markHabitComplete(
          habit.id,
          date
        );

        onCompletionChange(
          habit.id,
          newCompletion
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update this habit."
      );
    } finally {
      setUpdatingCompletion(false);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={handleCompletionToggle}
          disabled={updatingCompletion}
          aria-pressed={isComplete}
          aria-label={
            isComplete
              ? `Mark ${habit.title} incomplete`
              : `Mark ${habit.title} complete`
          }
          className={[
            "mt-1 grid size-7 shrink-0 place-items-center rounded-full border-2 transition",
            isComplete
              ? "border-green-600 bg-green-600 text-white"
              : "border-slate-300 bg-white hover:border-green-500",
            updatingCompletion
              ? "cursor-not-allowed opacity-60"
              : "",
          ].join(" ")}
        >
          {isComplete && (
            <span aria-hidden="true">
              ✓
            </span>
          )}
        </button>

        <div
          className="mt-2 size-3 shrink-0 rounded-full"
          style={{
            backgroundColor:
              habit.color ?? "#16a34a",
          }}
        />

        <div className="min-w-0 flex-1">
          <h3
            className={[
              "text-lg font-semibold",
              isComplete
                ? "text-slate-500 line-through"
                : "text-slate-900",
            ].join(" ")}
          >
            {habit.title}
          </h3>

          {habit.description && (
            <p className="mt-1 text-sm text-slate-600">
              {habit.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            {habit.category && (
              <span className="rounded-full bg-slate-100 px-3 py-1">
                {habit.category}
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-3 py-1">
              Starts {habit.start_date}
            </span>

            {isComplete && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                Completed
              </span>
            )}
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="mt-3 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            onDelete(habit.id)
          }
          disabled={deleting}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
        >
          {deleting
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    </article>
  );
}
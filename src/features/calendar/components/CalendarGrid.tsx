import type {
  Habit,
  HabitCompletion,
} from "../../habits/types/habits";

type CalendarGridProps = {
  currentMonth: Date;
  selectedDate: Date | null;
  getHabitsForDate: (date: Date) => Habit[];
  completions: HabitCompletion[];
  onDateSelect: (date: Date) => void;
};

const weekdayLabels = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function isSameDate(
  firstDate: Date,
  secondDate: Date
): boolean {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

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

export default function CalendarGrid({
  currentMonth,
  selectedDate,
  getHabitsForDate,
  completions,
  onDateSelect,
}: CalendarGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  const cells: Array<Date | null> = [];

  for (
    let emptyCell = 0;
    emptyCell < firstDayOfMonth;
    emptyCell += 1
  ) {
    cells.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    cells.push(
      new Date(year, month, day)
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-7 gap-2">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-sm font-semibold text-slate-500"
          >
            {label}
          </div>
        ))}

        {cells.map((date, index) => {
          if (!date) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-28 rounded-xl bg-slate-50"
              />
            );
          }

          const habitsForDate =
            getHabitsForDate(date);

          const dateKey =
            getLocalDateKey(date);

          const completedCount =
            completions.filter(
              (completion) =>
                completion.completion_date === dateKey &&
                habitsForDate.some(
                  (habit) =>
                    habit.id === completion.habit_id
                )
            ).length;

          const totalCount =
            habitsForDate.length;

          const allCompleted =
            totalCount > 0 &&
            completedCount === totalCount;

          const completionPercentage =
            totalCount === 0
              ? 0
              : (completedCount / totalCount) * 100;

          const isSelected =
            selectedDate !== null &&
            isSameDate(
              date,
              selectedDate
            );

          const isToday =
            isSameDate(
              date,
              new Date()
            );

          return (
            <button
              key={`${year}-${month}-${date.getDate()}`}
              type="button"
              onClick={() =>
                onDateSelect(date)
              }
              className={[
                "min-h-28 rounded-xl border p-3 text-left transition",
                "hover:border-green-400 hover:bg-green-50/40",
                isSelected
                  ? "border-green-600 bg-green-50"
                  : "border-slate-200 bg-white",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "grid size-7 place-items-center rounded-full text-sm font-medium",
                    isToday
                      ? "bg-green-600 text-white"
                      : "text-slate-900",
                  ].join(" ")}
                >
                  {date.getDate()}
                </span>

                {totalCount > 0 && (
                  <span className="text-xs text-slate-400">
                    {totalCount}
                  </span>
                )}
              </div>

              {habitsForDate.length > 0 && (
                <div className="mt-3 space-y-1">
                  {habitsForDate
                    .slice(0, 3)
                    .map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center gap-2 rounded-md bg-green-50 px-2 py-1 text-xs text-green-800"
                      >
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              habit.color ??
                              "#16a34a",
                          }}
                        />

                        <span className="truncate">
                          {habit.title}
                        </span>
                      </div>
                    ))}

                  {habitsForDate.length > 3 && (
                    <p className="px-1 text-xs text-slate-500">
                      +{habitsForDate.length - 3} more
                    </p>
                  )}
                </div>
              )}

              {totalCount > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={
                        allCompleted
                          ? "font-medium text-green-700"
                          : "text-slate-500"
                      }
                    >
                      {completedCount}/{totalCount} completed
                    </span>

                    {allCompleted && (
                      <span
                        className="font-semibold text-green-600"
                        aria-label="All habits completed"
                      >
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
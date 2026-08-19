import type { HabitScheduleType } from "../types/habits";

type SchedulePickerProps = {
  scheduleType: HabitScheduleType;
  selectedDays: number[];
  dayOfMonth: number | null;
  onScheduleTypeChange: (type: HabitScheduleType) => void;
  onSelectedDaysChange: (days: number[]) => void;
  onDayOfMonthChange: (day: number | null) => void;
};

const days = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

export default function SchedulePicker({
  scheduleType,
  selectedDays,
  dayOfMonth,
  onScheduleTypeChange,
  onSelectedDaysChange,
  onDayOfMonthChange,
}: SchedulePickerProps) {
  function toggleDay(day: number) {
    if (selectedDays.includes(day)) {
      onSelectedDaysChange(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      onSelectedDaysChange([...selectedDays, day]);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="scheduleType"
          className="block font-medium text-slate-900"
        >
          Repeat
        </label>

        <select
          id="scheduleType"
          value={scheduleType}
          onChange={(event) =>
            onScheduleTypeChange(
              event.target.value as HabitScheduleType
            )
          }
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {scheduleType === "weekly" && (
        <div>
          <p className="font-medium text-slate-900">
            Repeat on
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {days.map((day) => {
              const selected = selectedDays.includes(day.value);

              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={[
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    selected
                      ? "bg-green-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  ].join(" ")}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {scheduleType === "monthly" && (
        <div>
          <label
            htmlFor="dayOfMonth"
            className="block font-medium text-slate-900"
          >
            Day of month
          </label>

          <input
            id="dayOfMonth"
            type="number"
            min={1}
            max={31}
            value={dayOfMonth ?? ""}
            onChange={(event) =>
              onDayOfMonthChange(
                event.target.value
                  ? Number(event.target.value)
                  : null
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>
      )}
    </div>
  );
}
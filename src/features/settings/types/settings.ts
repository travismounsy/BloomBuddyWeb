export type ThemePreference =
  | "system"
  | "light"
  | "dark";

export type WeekStartPreference =
  | "sunday"
  | "monday";

export type UserPreferences = {
  theme: ThemePreference;
  weekStart: WeekStartPreference;
};
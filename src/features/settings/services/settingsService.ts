import type {
  ThemePreference,
  UserPreferences,
  WeekStartPreference,
} from "../types/settings";

const STORAGE_KEY =
  "bloom-buddy-preferences";

const defaultPreferences: UserPreferences = {
  theme: "system",
  weekStart: "sunday",
};

export function getUserPreferences():
  UserPreferences {
  const stored =
    localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return defaultPreferences;
  }

  try {
    const parsed =
      JSON.parse(stored) as Partial<UserPreferences>;

    return {
      theme:
        parsed.theme ??
        defaultPreferences.theme,
      weekStart:
        parsed.weekStart ??
        defaultPreferences.weekStart,
    };
  } catch {
    return defaultPreferences;
  }
}

export function saveUserPreferences(
  preferences: UserPreferences
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(preferences)
  );

  applyThemePreference(
    preferences.theme
  );
}

export function updateThemePreference(
  theme: ThemePreference
) {
  const current =
    getUserPreferences();

  saveUserPreferences({
    ...current,
    theme,
  });
}

export function updateWeekStartPreference(
  weekStart: WeekStartPreference
) {
  const current =
    getUserPreferences();

  saveUserPreferences({
    ...current,
    weekStart,
  });
}

export function applyThemePreference(
  theme: ThemePreference
) {
  const root =
    document.documentElement;

  const systemPrefersDark =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  const shouldUseDark =
    theme === "dark" ||
    (
      theme === "system" &&
      systemPrefersDark
    );

  root.classList.toggle(
    "dark",
    shouldUseDark
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../../components/ui/PageHeader";

import {
  getCurrentProfile,
  updateGardenVisibility,
} from "../../profile/services/profileService";

import { supabase } from "../../../lib/supabase";

import {
  applyThemePreference,
  getUserPreferences,
  saveUserPreferences,
} from "../services/settingsService";

import type {
  ThemePreference,
  WeekStartPreference,
} from "../types/settings";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [theme, setTheme] =
    useState<ThemePreference>("system");

  const [weekStart, setWeekStart] =
    useState<WeekStartPreference>("sunday");

  const [
    gardenVisibility,
    setGardenVisibility,
  ] = useState<
    "private" | "connections"
  >("private");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [signingOut, setSigningOut] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setErrorMessage("");

        const preferences =
          getUserPreferences();

        setTheme(
          preferences.theme
        );

        setWeekStart(
          preferences.weekStart
        );

        const profile =
          await getCurrentProfile();

        setGardenVisibility(
          profile.garden_visibility
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load settings."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      saveUserPreferences({
        theme,
        weekStart,
      });

      await updateGardenVisibility(
        gardenVisibility
      );

      setSuccessMessage(
        "Settings saved successfully."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    setErrorMessage("");

    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign out."
      );

      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Preferences"
          title="Settings"
          description="Customize your Bloom Buddy experience."
        />

        <section
          className="
            rounded-[2rem]
            border border-emerald-950/10
            bg-white p-6 shadow-sm
            transition-colors duration-200

            dark:border-white/10
            dark:bg-slate-900
          "
        >
          <p className="text-slate-600 dark:text-slate-400">
            Loading settings...
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Customize your Bloom Buddy experience."
      />

      {errorMessage && (
        <p
          role="alert"
          className="
            mb-6 rounded-xl
            bg-red-50 p-4
            text-sm text-red-700

            dark:bg-red-950/40
            dark:text-red-300
          "
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="
            mb-6 rounded-xl
            bg-green-50 p-4
            text-sm text-green-700

            dark:bg-emerald-950/40
            dark:text-emerald-300
          "
        >
          {successMessage}
        </p>
      )}

      <section className="space-y-6">
        {/* Appearance */}
        <article
          className="
            rounded-[2rem]
            border border-emerald-950/10
            bg-white p-6 shadow-sm
            transition-colors duration-200

            dark:border-white/10
            dark:bg-slate-900
          "
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Appearance
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Choose how Bloom Buddy should look on this device.
          </p>

          <div className="mt-5">
            <label
              htmlFor="theme"
              className="block font-medium text-slate-900 dark:text-slate-200"
            >
              Theme
            </label>

            <select
              id="theme"
              value={theme}
              onChange={(event) => {
                const newTheme =
                  event.target.value as ThemePreference;

                setTheme(newTheme);

                saveUserPreferences({
                  theme: newTheme,
                  weekStart,
                });

                applyThemePreference(
                  newTheme
                );
              }}
              className="
                mt-2 w-full max-w-md
                rounded-lg
                border border-slate-300
                bg-white px-4 py-3
                text-slate-900
                transition-colors duration-200

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-100
              "
            >
              <option value="system">
                System default
              </option>

              <option value="light">
                Light
              </option>

              <option value="dark">
                Dark
              </option>
            </select>
          </div>
        </article>

        {/* Calendar */}
        <article
          className="
            rounded-[2rem]
            border border-emerald-950/10
            bg-white p-6 shadow-sm
            transition-colors duration-200

            dark:border-white/10
            dark:bg-slate-900
          "
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Calendar
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Choose which day starts your week.
          </p>

          <div className="mt-5">
            <label
              htmlFor="weekStart"
              className="block font-medium text-slate-900 dark:text-slate-200"
            >
              Start week on
            </label>

            <select
              id="weekStart"
              value={weekStart}
              onChange={(event) => {
                const newWeekStart =
                  event.target.value as WeekStartPreference;

                setWeekStart(newWeekStart);

                saveUserPreferences({
                  theme,
                  weekStart: newWeekStart,
                });
              }}
              className="
                mt-2 w-full max-w-md
                rounded-lg
                border border-slate-300
                bg-white px-4 py-3
                text-slate-900
                transition-colors duration-200

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-100
              "
            >
              <option value="sunday">
                Sunday
              </option>

              <option value="monday">
                Monday
              </option>
            </select>
          </div>
        </article>

        {/* Garden privacy */}
        <article
          className="
            rounded-[2rem]
            border border-emerald-950/10
            bg-white p-6 shadow-sm
            transition-colors duration-200

            dark:border-white/10
            dark:bg-slate-900
          "
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Garden Privacy
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Control who can see your garden when social features are enabled.
          </p>

          <div className="mt-5">
            <label
              htmlFor="gardenVisibility"
              className="block font-medium text-slate-900 dark:text-slate-200"
            >
              Garden visibility
            </label>

            <select
              id="gardenVisibility"
              value={gardenVisibility}
              onChange={(event) =>
                setGardenVisibility(
                  event.target.value as
                    | "private"
                    | "connections"
                )
              }
              className="
                mt-2 w-full max-w-md
                rounded-lg
                border border-slate-300
                bg-white px-4 py-3
                text-slate-900
                transition-colors duration-200

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-slate-100
              "
            >
              <option value="private">
                Private
              </option>

              <option value="connections">
                Connections only
              </option>
            </select>
          </div>
        </article>

        {/* Account */}
        <article
          className="
            rounded-[2rem]
            border border-emerald-950/10
            bg-white p-6 shadow-sm
            transition-colors duration-200

            dark:border-white/10
            dark:bg-slate-900
          "
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Account
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage your current session.
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="
              mt-5 rounded-lg
              border border-red-200
              px-5 py-3
              font-semibold text-red-700
              transition

              hover:bg-red-50

              dark:border-red-900/70
              dark:text-red-300
              dark:hover:bg-red-950/40

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {signingOut
              ? "Signing out..."
              : "Sign Out"}
          </button>
        </article>
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="
          mt-8 rounded-lg
          bg-green-600 px-6 py-3
          font-semibold text-white
          transition

          hover:bg-green-700

          dark:bg-emerald-600
          dark:hover:bg-emerald-500

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {saving
          ? "Saving..."
          : "Save Settings"}
      </button>
    </>
  );
}
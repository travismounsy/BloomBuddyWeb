import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../auth/hooks/useAuth";

export default function SettingsPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      await signOut();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again."
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-900">
        Settings
      </h1>

      <p className="mt-2 text-slate-600">
        Manage your Bloom Buddy preferences and account.
      </p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Account
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          Sign out of your Bloom Buddy account on this device.
        </p>

        {errorMessage && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="mt-5 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSigningOut ? "Logging out..." : "Log Out"}
        </button>
      </div>
    </section>
  );
}
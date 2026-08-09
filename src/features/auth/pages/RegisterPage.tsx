import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../lib/supabase.ts";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      "Account created! Please check your email to verify your account."
    );
  }

  return (
    <section>
      <h1 className="text-3xl font-bold">Create your account</h1>

      <p className="mt-2 text-slate-600">
        Start building habits and growing your Bloom Buddy.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="displayName" className="block font-medium">
            Display name
          </label>

          <input
            id="displayName"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        {error && (
          <p className="rounded bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded bg-green-100 p-3 text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-green-700">
          Log in
        </Link>
      </p>
    </section>
  );
}
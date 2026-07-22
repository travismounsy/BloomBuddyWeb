import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Welcome back</h1>

      <p className="mt-2 text-slate-600">
        Log in to continue growing your habits.
      </p>

      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white"
        >
          Log In
        </button>
      </form>

      <div className="mt-6 space-y-3 text-center text-sm">
        <Link
          to="/forgot-password"
          className="block font-medium text-green-700"
        >
          Forgot your password?
        </Link>

        <p className="text-slate-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-green-700">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
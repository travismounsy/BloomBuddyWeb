import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Create your account</h1>

      <p className="mt-2 text-slate-600">
        Start building habits and growing your Bloom Buddy.
      </p>

      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="displayName" className="block font-medium">
            Display name
          </label>

          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

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
            autoComplete="new-password"
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white"
        >
          Create Account
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
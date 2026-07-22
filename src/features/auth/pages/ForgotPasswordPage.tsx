import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Reset your password</h1>

      <p className="mt-2 text-slate-600">
        Enter your email address and we will send you password reset
        instructions.
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

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white"
        >
          Send Reset Link
        </button>
      </form>

      <Link
        to="/login"
        className="mt-6 block text-center font-medium text-green-700"
      >
        Return to login
      </Link>
    </section>
  );
}
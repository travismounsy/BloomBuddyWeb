import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 font-semibold uppercase tracking-wider text-green-600">
            Build habits that grow
          </p>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Grow better habits, one day at a time.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Bloom Buddy turns your daily routines into a growing virtual
            garden. Complete habits, maintain streaks, and watch your progress
            bloom.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Create an Account
            </Link>

            <Link
              to="/login"
              className="rounded-lg border border-green-600 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-100"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white p-10 shadow-sm">
          <div className="flex min-h-80 items-center justify-center rounded-2xl bg-green-50">
            <p className="text-center text-lg font-medium text-green-700">
              Bloom Buddy plant preview
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Build consistency visually</h2>

            <p className="mt-3 text-slate-600">
              Track your routines and turn daily progress into a growing
              garden.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold">Habit Tracking</h3>
              <p className="mt-3 text-slate-600">
                Create personalized habits and record your daily completions.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold">Plant Growth</h3>
              <p className="mt-3 text-slate-600">
                Watch your virtual plant grow as you maintain consistency.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xl font-semibold">Progress Insights</h3>
              <p className="mt-3 text-slate-600">
                Review streaks, completion history, and weekly progress.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="technology" className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold">
            Built with a modern technology stack
          </h2>

          <p className="mt-5 leading-7 text-slate-600">
            Bloom Buddy uses React, TypeScript, Vite, React Router, Tailwind
            CSS, Supabase Authentication, PostgreSQL, and Supabase Storage.
          </p>
        </div>
      </section>
    </>
  );
}
import { Outlet } from "react-router-dom";
import BottomNav from "../navigation/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[16rem_1fr]">
      <BottomNav />

      <div className="min-w-0">
        <header className="border-b border-emerald-950/10 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Bloom Buddy
              </p>

              <p className="text-sm text-slate-600">
                Build healthier routines, one habit at a time.
              </p>
            </div>

            <button
              type="button"
              className="
                grid size-10 place-items-center rounded-full
                bg-emerald-100 font-semibold text-emerald-900
                transition hover:bg-emerald-200
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-emerald-700
              "
              aria-label="Open user profile"
            >
              TM
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-5 pb-28 pt-6 sm:px-8 md:pb-10 md:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
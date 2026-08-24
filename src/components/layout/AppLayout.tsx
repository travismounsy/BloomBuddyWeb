import { Outlet } from "react-router-dom";

import BottomNav from "../navigation/BottomNav";
import ScrollToTop from "../navigation/ScrollToTop";



export default function AppLayout() {
  return (
    <div
      className="
        min-h-screen
        bg-slate-50 text-slate-900
        transition-colors duration-200

        dark:bg-slate-950 dark:text-slate-100
      "
    >
      <ScrollToTop />
      <BottomNav />

      <div className="min-w-0 md:ml-64">
        <header
          className="
            border-b border-emerald-950/10
            bg-white/75 backdrop-blur
            transition-colors duration-200

            dark:border-white/10
            dark:bg-slate-900/75
          "
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <div>
              <p
                className="
                  text-xs font-semibold uppercase tracking-[0.2em]
                  text-emerald-700
                  dark:text-emerald-300
                "
              >
                Bloom Buddy
              </p>

              <p
                className="
                  text-sm text-slate-600
                  dark:text-slate-400
                "
              >
                Build healthier routines, one habit at a time.
              </p>
            </div>

            <button
              type="button"
              className="
                grid size-10 place-items-center rounded-full
                bg-emerald-100 font-semibold text-emerald-900
                transition hover:bg-emerald-200

                dark:bg-emerald-900/50
                dark:text-emerald-200
                dark:hover:bg-emerald-800/70

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
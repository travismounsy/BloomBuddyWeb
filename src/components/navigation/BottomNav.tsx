import {
  BarChart3,
  CheckSquare,
  Home,
  Settings,
  Sprout,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "Home",
    icon: Home,
    end: true,
  },
  {
    to: "/habits",
    label: "Habits",
    icon: CheckSquare,
  },
  {
    to: "/progress",
    label: "Progress",
    icon: BarChart3,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="Primary navigation"
      className="
        fixed inset-x-4 bottom-4 z-50
        rounded-3xl border border-white/70
        bg-emerald-900/95 px-3 py-2
        shadow-[0_18px_50px_rgba(20,83,45,0.25)]
        backdrop-blur
        md:static md:flex md:h-screen md:w-64 md:flex-col
        md:rounded-none md:border-0 md:px-5 md:py-8
      "
    >
      <div className="hidden items-center gap-3 px-3 md:mb-10 md:flex">
        <div className="grid size-11 place-items-center rounded-2xl bg-lime-200 text-emerald-900">
          <Sprout size={25} aria-hidden="true" />
        </div>

        <div>
          <p className="text-lg font-bold text-white">Bloom Buddy</p>
          <p className="text-xs text-emerald-200">Grow every day</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 md:flex md:flex-col md:gap-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }: { isActive: boolean }) =>
              [
                "flex min-h-14 flex-col items-center justify-center gap-1",
                "rounded-2xl px-2 py-2 text-xs font-medium",
                "transition duration-200",
                "md:min-h-12 md:flex-row md:justify-start md:gap-3",
                "md:px-4 md:text-sm",
                isActive
                  ? "bg-lime-200 text-emerald-950 shadow-sm"
                  : "text-emerald-100 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            <Icon size={21} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
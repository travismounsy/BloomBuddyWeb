import { Link, NavLink } from "react-router-dom";

export default function PublicNavbar() {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-semibold text-green-700"
      : "text-slate-600 transition hover:text-green-700";

  return (
    <header className="border-b border-green-100 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-green-700">
          Bloom Buddy
        </Link>

        <div className="flex items-center gap-5">
          <NavLink to="/" end className={getNavLinkClass}>
            Home
          </NavLink>

          <NavLink to="/login" className={getNavLinkClass}>
            Log In
          </NavLink>

          <Link
            to="/register"
            className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
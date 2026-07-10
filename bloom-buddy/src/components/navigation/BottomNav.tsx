import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav aria-label="Main navigation">
      <NavLink to="/" end>
        Home
      </NavLink>

      <NavLink to="/habits">
        Habits
      </NavLink>

      <NavLink to="/progress">
        Progress
      </NavLink>

      <NavLink to="/settings">
        Settings
      </NavLink>
    </nav>
  );
}
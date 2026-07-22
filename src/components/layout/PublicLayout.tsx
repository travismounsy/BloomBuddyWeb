import { Outlet } from "react-router-dom";
import PublicNavbar from "../navigation/PublicNavbar.tsx";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-green-50 text-slate-900">
      <PublicNavbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
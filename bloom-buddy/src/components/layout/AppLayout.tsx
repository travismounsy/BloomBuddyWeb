import { Outlet } from "react-router-dom";

import BottomNav from "../navigation/BottomNav";

export default function AppLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>

      <BottomNav />
    </>
  );
}
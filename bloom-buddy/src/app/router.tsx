import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import HomePage from "../features/plant/pages/HomePage";
import HabitsPage from "../features/habits/pages/HabitsPage";
import ProgressPage from "../features/progress/pages/ProgressPage";
import SettingsPage from "../features/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "habits",
        element: <HabitsPage />,
      },
      {
        path: "progress",
        element: <ProgressPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
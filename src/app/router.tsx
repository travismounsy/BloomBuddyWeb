import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import HabitsPage from "../features/habits/pages/HabitsPage";
import HomePage from "../features/plant/pages/HomePage";
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
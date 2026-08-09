import {
  Navigate,
  Outlet,
} from "react-router-dom";

import useAuth from "../../features/auth/hooks/useAuth";

export default function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-green-50">
        <p className="font-medium text-emerald-800">
          Loading Bloom Buddy...
        </p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  /*
   * Temporary behavior:
   * Allow protected routes while authentication is being developed.
   *
   * Later, this component will:
   * 1. Check the Supabase session.
   * 2. Show a loading state while restoring the session.
   * 3. Redirect unauthenticated users to /login.
   * 4. Render <Outlet /> for authenticated users.
   */

  return <Outlet />;
}
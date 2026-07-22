import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      <header className="px-6 py-5">
        <Link to="/" className="text-xl font-bold text-green-700">
          Bloom Buddy
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
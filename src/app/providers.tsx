import type { PropsWithChildren } from "react";

import AuthProvider from "../features/auth/context/AuthContext";

export default function AppProviders({
  children,
}: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
const queryclient = new QueryClient();
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryclient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}

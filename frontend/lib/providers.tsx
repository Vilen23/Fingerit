"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryclient = new QueryClient();
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
  );
}

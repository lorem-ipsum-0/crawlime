"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useMemo, type PropsWithChildren } from "react";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ReactQueryProvider>
      <SessionProvider>{children}</SessionProvider>
    </ReactQueryProvider>
  );
};

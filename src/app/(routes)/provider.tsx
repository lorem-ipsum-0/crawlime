"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type PropsWithChildren } from "react";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const Providers = ({ children }: PropsWithChildren) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

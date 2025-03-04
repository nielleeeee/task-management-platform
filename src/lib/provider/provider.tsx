"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import { PUBLIC_ROUTES } from "@/lib/constant";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Provider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 120 * 1000,
            refetchInterval: 180 * 1000,
          },
        },
      })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        {!isPublicRoute && <Header />}
        {children}
      </QueryClientProvider>
    </>
  );
}

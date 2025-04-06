"use client";

import { getQueryClient } from "@/utils/getQueryClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface QueryClientComponentProps {
  children: React.ReactNode;
}
export default function QueryClientComponent({
  children,
}: QueryClientComponentProps) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

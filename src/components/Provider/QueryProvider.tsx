"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProvider {
    children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProvider) {
    //** States */
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 mins
                        retry: 1,
                        refetchOnWindowFocus: false,
                        refetchOnMount: false,
                    },
                },
            }),
    );

    //** Return */
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}

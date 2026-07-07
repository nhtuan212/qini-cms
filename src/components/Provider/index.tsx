"use client";

// Must be imported first so polyfills are installed before any client code runs
import "@/polyfills";
import React from "react";
import { SessionProvider } from "next-auth/react";
import UIProvider from "./UIProvider";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <UIProvider>
            <SessionProvider>{children}</SessionProvider>
        </UIProvider>
    );
}

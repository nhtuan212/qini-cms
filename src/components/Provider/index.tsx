"use client";

// Must be imported first so polyfills are installed before any client code runs
import "@/polyfills";
import React from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import UIProvider from "./UIProvider";
import AuthSync from "./AuthSync";

export default function AuthProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session?: Session | null;
}) {
    return (
        <UIProvider>
            <SessionProvider session={session}>
                <AuthSync />
                {children}
            </SessionProvider>
        </UIProvider>
    );
}

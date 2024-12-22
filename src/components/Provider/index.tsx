"use client";

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

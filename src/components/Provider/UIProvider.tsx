"use client";

import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function UIProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider locale="vi-VN">
            <NextThemesProvider attribute="class" defaultTheme={"light"}>
                {children}
            </NextThemesProvider>
        </NextUIProvider>
    );
}

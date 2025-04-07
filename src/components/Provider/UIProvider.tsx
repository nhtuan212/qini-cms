"use client";

import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function UIProvider({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider locale="vi-VN">
            <NextThemesProvider attribute="class" defaultTheme={"light"}>
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    );
}

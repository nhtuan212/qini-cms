import React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { auth } from "@/auth";
import Provider from "@/components/Provider";
import MainLayout from "@/components/layouts";
import "./globals.scss";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "Qini",
    description: "Qini fashion",
    viewport,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    //** Render */
    const RenderMainLayout = () => {
        if (session) {
            return <MainLayout session={session}>{children}</MainLayout>;
        }

        return children;
    };

    return (
        <html suppressHydrationWarning lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Provider>{RenderMainLayout()}</Provider>
            </body>
        </html>
    );
}

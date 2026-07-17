import React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { auth } from "@/auth";
import QueryProvider from "@/components/Provider/QueryProvider";
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
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    //** Render */
    const RenderMainLayout = () => {
        // Session "pending" (first-login, chưa tạo mật khẩu) không dựng layout
        // chính — chỉ render trang set-password để tránh gọi query cần token.
        if (session && !session.user?.isFirstLogin) {
            return <MainLayout session={session}>{children}</MainLayout>;
        }

        return children;
    };

    return (
        <html suppressHydrationWarning lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <QueryProvider>
                    <Provider session={session}>{RenderMainLayout()}</Provider>
                </QueryProvider>
            </body>
        </html>
    );
}

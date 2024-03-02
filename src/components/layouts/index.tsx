"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import { useProfileStore } from "@/stores/useProfileStore";
import { ProfileProps } from "@/types/profileProps";

export default function Layouts({
    session,
    children,
}: {
    session: ProfileProps;
    children: React.ReactNode;
}) {
    //** Store */
    const { getProfile } = useProfileStore();

    //** Effects */
    useEffect(() => {
        getProfile(session);
    }, [getProfile, session]);

    return (
        <main>
            <Header />
            <section className="container py-4">{children}</section>
        </main>
    );
}

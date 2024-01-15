"use client";

import React, { useEffect } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { ProfileProps } from "@/types/profileProps";
import Header from "./Header";

export default function Layouts({
    session,
    children,
}: {
    session: ProfileProps;
    children: React.ReactNode;
}) {
    //** Zustand */
    const { getProfile } = useProfileStore();

    //** Hooks */
    useEffect(() => {
        getProfile(session);
    }, [getProfile, session]);

    return (
        <main>
            <Header />
            {children}
        </main>
    );
}

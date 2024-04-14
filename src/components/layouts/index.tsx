"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import ConfirmModal from "../ConfirmModal";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
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
    const { modalMessage, onConfirm, onCancel } = useModalStore();

    //** Effects */
    useEffect(() => {
        getProfile(session);
    }, [getProfile, session]);

    return (
        <main>
            <Header />
            <section className="container py-4">{children}</section>

            {/* Confirm modal */}
            <ConfirmModal modalMessage={modalMessage} onConfirm={onConfirm} onCancel={onCancel} />
        </main>
    );
}

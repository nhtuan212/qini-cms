"use client";

import React, { useEffect, useState } from "react";
import NotFound from "@/app/not-found";
import Header from "./Header";
import Alert from "../Alert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { Session } from "next-auth";
import { getCurrentLocation, verifyLocation } from "@/utils";
import { ROLE } from "@/constants";

export default function MainLayout({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session;
}) {
    //** States */
    const [isLocationValid, setIsLocationValid] = useState<boolean | null>(null);

    //** Store */
    const { profile, getProfile } = useProfileStore();
    const { modal, getModal } = useModalStore();
    const { alert, getAlert } = useAlertStore();

    //** Effects */
    useEffect(() => {
        getProfile(session);
    }, [getProfile, session]);

    useEffect(() => {
        // Check location
        const checkLocation = async () => {
            try {
                const { lat, lng } = await getCurrentLocation();
                const { isValid } = verifyLocation(lat, lng);
                setIsLocationValid(isValid);
            } catch (error) {
                // If user denies geolocation permission, redirect to not found
                if (error instanceof Error && error.message.includes("từ chối quyền truy cập")) {
                    setIsLocationValid(false);
                } else {
                    // For other errors, still set as invalid but could show different message
                    setIsLocationValid(false);
                }
            }
        };

        checkLocation();
    }, []);

    //** Render */
    if (isLocationValid !== null && !isLocationValid && profile?.role !== ROLE.ADMIN) {
        return <NotFound />;
    }

    return (
        <main className="h-screen">
            <Header />

            <section className="container py-4">{children}</section>

            <Modal
                isOpen={modal.isOpen}
                size={modal.size}
                isDismissable={modal.isDismissable}
                onOpenChange={(isOpen: boolean) => getModal({ isOpen, size: modal.size })}
                onClose={() => {
                    modal.onClose && modal.onClose();
                }}
            >
                <ModalHeader>{modal.modalHeader && modal.modalHeader}</ModalHeader>
                {modal.modalBody && <ModalBody>{modal.modalBody}</ModalBody>}
                <ModalFooter>{modal.modalFooter}</ModalFooter>
            </Modal>

            <Alert
                {...alert}
                onClose={() => {
                    getAlert({ isOpen: false });
                }}
            >
                {alert.alertContent}
            </Alert>
        </main>
    );
}

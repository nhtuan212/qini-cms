"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import Alert from "../Alert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { Session } from "next-auth";

export default function MainLayout({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session;
}) {
    //** Store */
    const { getProfile } = useProfileStore();
    const { modal, getModal } = useModalStore();
    const { alert, getAlert } = useAlertStore();

    //** Effects */
    useEffect(() => {
        getProfile(session);
    }, [getProfile, session]);

    return (
        <main className="h-screen">
            <Header />

            <section className="container py-4">{children}</section>

            <Modal
                isOpen={modal.isOpen}
                size={modal.size}
                isDismissable={modal.isDismissable}
                onOpenChange={(isOpen: boolean) => getModal({ isOpen })}
                onClose={() => {
                    modal.onClose && modal.onClose();
                }}
            >
                <ModalHeader>{modal.modalHeader && modal.modalHeader}</ModalHeader>
                {modal.modalBody && <ModalBody>{modal.modalBody}</ModalBody>}
                {modal.modalFooter && <ModalFooter>{modal.modalFooter}</ModalFooter>}
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

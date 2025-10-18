"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import Alert from "../Alert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from "../Drawer";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { useDrawerStore } from "@/stores/useDrawerStore";
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
    const { drawer, getDrawer } = useDrawerStore();
    const { alert, getAlert } = useAlertStore();

    //** Effects */
    useEffect(() => {
        getProfile(session);
    }, [getProfile, session]);

    //** Render */
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

            <Drawer
                isOpen={drawer.isOpen}
                size={drawer.size}
                isDismissable={drawer.isDismissable}
                onOpenChange={(isOpen: boolean) => getDrawer({ isOpen, size: drawer.size })}
                onClose={() => {
                    drawer.onClose && drawer.onClose();
                }}
            >
                <DrawerHeader>{drawer.drawerHeader && drawer.drawerHeader}</DrawerHeader>
                {drawer.drawerBody && <DrawerBody>{drawer.drawerBody}</DrawerBody>}
                <DrawerFooter>{drawer.drawerFooter}</DrawerFooter>
            </Drawer>

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

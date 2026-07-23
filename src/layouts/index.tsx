"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import NavMenu from "./NavMenu";
import Alert from "@/components/Alert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/components/Modal";
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from "@/components/Drawer";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { useShift } from "@/hooks";
import { getMenusForRole } from "@/config/menu";
import { Session } from "next-auth";

export default function MainLayout({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session;
}) {
    //** Store */
    const { profile, getProfile } = useProfileStore();
    const { modal, getModal } = useModalStore();
    const { drawer, getDrawer } = useDrawerStore();
    const { alert, getAlert } = useAlertStore();

    //** Variables */
    const hasNav = getMenusForRole(profile?.role).length > 1;

    //** Queries */
    useShift();

    //** Effects */
    useEffect(() => {
        getProfile(session);
    }, [getProfile, session]);

    //** Render */
    return (
        <main className="flex flex-col h-screen">
            <Header />

            <div className="flex flex-1 min-h-0">
                {/* Persistent sidebar on lg+ screens, pushes content to the right */}
                {hasNav && (
                    <aside className="hidden lg:block w-64 shrink-0 overflow-y-auto border-r border-default-200 px-3 py-4">
                        <NavMenu />
                    </aside>
                )}

                <section className="flex-1 min-h-0 w-full overflow-y-auto px-4 py-4">
                    {children}
                </section>
            </div>

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

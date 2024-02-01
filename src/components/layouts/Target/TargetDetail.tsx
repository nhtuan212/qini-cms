"use client";

import React from "react";
import Modal from "@/components/Modal";
import { useModalStore } from "@/stores/useModalStore";
import { TEXT } from "@/constants/text";
import { MODAL } from "@/constants";

export default function TargetDetail({ name }: { name: string }) {
    //** Stores */
    const { openModal, modalName } = useModalStore();

    return (
        <Modal
            isOpen={modalName === MODAL.TARGET_DETAIL}
            size="4xl"
            onOpenChange={() => openModal("")}
        >
            <Modal.Header>{`${TEXT.TARGET_OF} ${name}`}</Modal.Header>
        </Modal>
    );
}

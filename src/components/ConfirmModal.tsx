"use client";

import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { useModalStore } from "@/stores/useModalStore";
import { MODAL } from "@/constants";

type ConfirmModalProps = {
    modalMessage: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({ ...props }: ConfirmModalProps) {
    //** Destructuring */
    const { modalMessage, onConfirm, onCancel } = props;

    //** Stores */
    const { modalName, openModal } = useModalStore();

    return (
        <Modal
            isOpen={modalName === MODAL.CONFIRM}
            size="sm"
            hideCloseButton
            onOpenChange={() => openModal("")}
        >
            <Modal.Header>{modalMessage}</Modal.Header>
            <Modal.Footer>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    );
}

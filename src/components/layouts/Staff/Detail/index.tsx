"use client";

import React, { useEffect } from "react";
import TargetTab from "./TargetTab";
import Modal from "@/components/Modal";
import { useStaffStore } from "@/stores/useStaffStore";
import { MODAL } from "@/constants";
import { useModalStore } from "@/stores/useModalStore";

export default function StaffDetail() {
    //** Stores */
    const { staffById, getStaffById } = useStaffStore();
    const { modalName, openModal } = useModalStore();

    //** Effects */
    useEffect(() => {
        getStaffById(staffById?.id);
    }, [getStaffById, staffById?.id]);

    return (
        <Modal
            isOpen={modalName === MODAL.STAFF_DETAIL}
            size="4xl"
            onOpenChange={() => openModal("")}
        >
            <Modal.Header>
                <div className="title mb-5">{staffById?.name}</div>
            </Modal.Header>
            <Modal.Body>
                <TargetTab />
            </Modal.Body>
        </Modal>
    );
}

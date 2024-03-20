"use client";

import React, { useEffect } from "react";
import TargetTab from "./TargetTab";
import SalaryTab from "./SalaryTab";
import Modal from "@/components/Modal";
import { Tab, Tabs } from "@nextui-org/react";
import { useStaffStore } from "@/stores/useStaffStore";
import { TEXT } from "@/constants/text";
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
                <Tabs aria-label="Options">
                    <Tab key="revenue" title={TEXT.REVENUE}>
                        <TargetTab />
                    </Tab>
                    <Tab key="salary" title={TEXT.SALARY}>
                        <SalaryTab />
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
}

"use client";

import React from "react";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import TargetDetailColumns from "./TargetDetailColumns";
import TargetDetailTopContent from "./TargetDetailTopContent";
import { useModalStore } from "@/stores/useModalStore";
import { useReportStore } from "@/stores/useReportStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { TEXT } from "@/constants/text";
import { MODAL } from "@/constants";

export default function TargetDetail() {
    //** Stores */
    const { openModal, modalName } = useModalStore();
    const { reportByStaff } = useReportStore();
    const { staffById } = useStaffStore();

    return (
        <Modal
            isOpen={modalName === MODAL.TARGET_DETAIL}
            size="4xl"
            onOpenChange={() => openModal("")}
        >
            <Modal.Header>{`${TEXT.TARGET_OF} ${staffById?.name}`}</Modal.Header>
            <Modal.Body>
                <Table
                    columns={TargetDetailColumns()}
                    rows={reportByStaff}
                    topContent={<TargetDetailTopContent />}
                    isCheckedList
                    isPagination
                    pageSize={5}
                    rowsPerPage={[5, 10, 15]}
                />
            </Modal.Body>
        </Modal>
    );
}

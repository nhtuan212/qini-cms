"use client";

import React, { useMemo } from "react";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import ReportColumns from "./ReportColumns";
import { useReportStore } from "@/stores/useReportStore";
import { useRevenueStore } from "@/stores/useRevenueStore";
import { dateFormat } from "@/utils";
import { TEXT } from "@/constants/text";

export default function ReportDetail({ revenueId }: { revenueId: string }) {
    const { revenue } = useRevenueStore();
    const { report, isReportModalOpen, openReportModal } = useReportStore();

    const revenueById: any = useMemo(
        () => revenue.find((item: any) => item.id === revenueId),
        [revenue, revenueId],
    );

    const reportFilter = useMemo(
        () => report.filter((item: any) => item.revenueId === revenueId),
        [report, revenueId],
    );

    return (
        <Modal isOpen={isReportModalOpen} size="4xl" onOpenChange={() => openReportModal(false)}>
            <Modal.Header>
                <h3>{`${TEXT.REPORT_DATE}: ${dateFormat(revenueById?.createAt)}`}</h3>
            </Modal.Header>
            <Modal.Body>
                <Table columns={ReportColumns()} rows={reportFilter} />
            </Modal.Body>
        </Modal>
    );
}

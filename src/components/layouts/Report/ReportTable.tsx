"use client";

import React, { useEffect } from "react";
import RevenueColumns from "./RevenueColumns";
import RevenueAddNew from "./RevenueAddNew";
import ReportDetail from "./ReportDetail";
import TopContent from "./TopContent";
import Table from "@/components/Table";
import ConfirmModal from "@/components/ConfirmModal";
import { useReportStore } from "@/stores/useReportStore";
import { useRevenueStore } from "@/stores/useRevenueStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";

export default function ReportTable() {
    //** Stores */
    const { getReport } = useReportStore();
    const { revenue, getRevenue } = useRevenueStore();
    const { getStaff } = useStaffStore();
    const { modalMessage, onConfirm, onCancel } = useModalStore();

    //** Effects */
    useEffect(() => {
        getRevenue();
        getReport();
        getStaff();
    }, [getReport, getRevenue, getStaff]);

    return (
        <>
            <Table
                columns={RevenueColumns()}
                topContent={<TopContent />}
                rows={revenue}
                paginationMode={{ pageSize: 10, pageSizeOptions: [5, 10] }}
            />

            {/* Popup add new revenue */}
            <RevenueAddNew />

            {/* Popup detail revenue when click eye icon */}
            <ReportDetail />

            {/* Confirm modal */}
            <ConfirmModal modalMessage={modalMessage} onConfirm={onConfirm} onCancel={onCancel} />
        </>
    );
}

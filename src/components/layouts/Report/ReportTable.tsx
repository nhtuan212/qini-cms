"use client";

import React, { useEffect } from "react";
import Table from "@/components/Table";
import RevenueColumns from "./RevenueColumns";
import RevenueAddNew from "./RevenueAddNew";
import ReportDetail from "./ReportDetail";
import TopContent from "./TopContent";
import { useReportStore } from "@/stores/useReportStore";
import { useRevenueStore } from "@/stores/useRevenueStore";
import { useStaffStore } from "@/stores/useStaffStore";

export default function ReportTable() {
    //** Stores */
    const { getReport } = useReportStore();
    const { revenue, getRevenue } = useRevenueStore();
    const { getStaff } = useStaffStore();

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
                rows={revenue}
                topContent={<TopContent />}
                isCheckedList
                isPagination
                pageSize={10}
                rowsPerPage={[10, 15, 20, 30]}
            />

            {/* Popup add new revenue */}
            <RevenueAddNew />

            {/* Popup detail revenue when click eye icon */}
            <ReportDetail />
        </>
    );
}

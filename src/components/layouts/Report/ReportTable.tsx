"use client";

import React, { useEffect } from "react";
import RevenueColumns from "./RevenueColumns";
import RevenueAddNew from "./RevenueAddNew";
import ReportDetail from "./ReportDetail";
import TopContent from "./TopContent";
import Table from "@/components/Table";
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
                className="h-[70rem]"
                columns={RevenueColumns()}
                topContent={<TopContent />}
                rows={revenue}
                paginationMode={{ pageSize: 10, pageSizeOptions: [10, 20, 30] }}
            />

            {/* Popup add new revenue */}
            <RevenueAddNew />

            {/* Popup detail revenue when click eye icon */}
            <ReportDetail />
        </>
    );
}

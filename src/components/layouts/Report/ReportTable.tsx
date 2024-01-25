"use client";

import React, { useEffect } from "react";
import Table from "@/components/Table";
import RevenueColumns from "./RevenueColumns";
import RevenueAddNew from "./RevenueAddNew";
import ReportDetail from "./ReportDetail";
import TopContent from "./TopContent";
import { useReportStore } from "@/stores/useReportStore";
import { useRevenueStore } from "@/stores/useRevenueStore";

export default function ReportTable() {
    //** Stores */
    const { revenueId, getReport } = useReportStore();
    const { revenue, getRevenue } = useRevenueStore();

    //** Effects */
    useEffect(() => {
        getRevenue();
        getReport();
    }, [getReport, getRevenue]);

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
            {revenueId && <ReportDetail revenueId={revenueId} />}
        </>
    );
}

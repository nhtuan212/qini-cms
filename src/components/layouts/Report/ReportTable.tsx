"use client";

import React, { useEffect } from "react";
import ReportColumns from "./ReportColumns";
import ReportAddNew from "./ReportAddNew";
import ReportDetail from "./ReportDetail";
import TopContent from "./TopContent";
import Table from "@/components/Table";
import { useReportsStore } from "@/stores/useReportsStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore } from "@/stores/useShiftsStore";

export default function ReportTable() {
    //** Stores */
    const { report, getReport } = useReportsStore();
    const { getStaff } = useStaffStore();
    const { getShifts } = useShiftStore();

    //** Effects */
    useEffect(() => {
        getReport();
        getStaff();
        getShifts();
    }, [getReport, getStaff, getShifts]);

    return (
        <>
            <Table
                className="[&>.tableContainer]:h-[40rem]"
                columns={ReportColumns()}
                topContent={<TopContent />}
                rows={report}
                loading={report.length === 0}
                paginationMode={{ pageSize: 10, pageSizeOptions: [10, 20, 30] }}
            />

            {/* Popup add new report */}
            <ReportAddNew />

            {/* Popup detail report when click eye icon */}
            <ReportDetail />
        </>
    );
}

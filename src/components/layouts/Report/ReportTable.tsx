"use client";

import React, { useEffect } from "react";
import ReportColumns from "./ReportColumns";
import ReportAddNew from "./ReportAddNew";
import ReportDetail from "./ReportDetail";
import TopContent from "./TopContent";
import Table from "@/components/Table";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";
import { useReportsStore } from "@/stores/useReportsStore";
import { useStaffStore } from "@/stores/useStaffStore";

export default function ReportTable() {
    //** Stores */
    const { getReportsOnStaffs } = useReportsOnStaffsStore();
    const { report, getReport } = useReportsStore();
    const { getStaff } = useStaffStore();

    //** Effects */
    useEffect(() => {
        getReport();
        getReportsOnStaffs();
        getStaff();
    }, [getReport, getReportsOnStaffs, getStaff]);

    return (
        <>
            <Table
                columns={ReportColumns()}
                topContent={<TopContent />}
                rows={report}
                paginationMode={{ pageSize: 10, pageSizeOptions: [10, 20, 30] }}
            />

            {/* Popup add new report */}
            <ReportAddNew />

            {/* Popup detail report when click eye icon */}
            <ReportDetail />
        </>
    );
}

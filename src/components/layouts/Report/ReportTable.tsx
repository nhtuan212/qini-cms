"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
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
    const { report, isReportLoading, getReport } = useReportsStore();
    const { getStaff } = useStaffStore();
    const { getShifts } = useShiftStore();

    //** Variables */
    const reportGroupByDate = Object.entries(
        report.reduce((acc: any, item: any) => {
            const date = item.createAt.split("T")[0];

            if (!acc[date]) {
                acc[date] = [];
            }

            acc[date].push(item);

            return acc;
        }, {}),
    );

    //** Effects */
    useEffect(() => {
        getReport();
        getStaff();
        getShifts();
    }, [getReport, getStaff, getShifts]);

    return (
        <>
            <Table
                className={clsx(
                    "[&>.tableContainer]:h-[40rem]",
                    "[&_.bodyCell]:border-b [&_.bodyCell]:border-primary",
                )}
                columns={ReportColumns()}
                topContent={<TopContent />}
                rows={reportGroupByDate}
                loading={isReportLoading}
                paginationMode={{ pageSize: 10, pageSizeOptions: [10, 20, 30] }}
            />

            {/* Popup add new report */}
            <ReportAddNew />

            {/* Popup detail report when click eye icon */}
            <ReportDetail />
        </>
    );
}

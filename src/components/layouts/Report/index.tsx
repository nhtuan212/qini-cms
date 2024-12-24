"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import TopContent from "./TopContent";
import ReportColumns from "./ReportModal/ReportColumns";
import Table from "@/components/Table";
import { useReportsStore } from "@/stores/useReportsStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore } from "@/stores/useShiftsStore";
import { convertObjectToSearchQuery } from "@/utils";

export default function ReportLayout() {
    const router = useRouter();
    const searchParams = useSearchParams();

    //** Stores */
    const { isLoading, reports, reportPagination, getReport } = useReportsStore();
    const { getStaff } = useStaffStore();
    const { getShifts } = useShiftStore();

    //** Variables */
    const currentSearch = useMemo(
        () => ({
            ...Object.fromEntries(searchParams.entries()),
            page: searchParams.get("page") || "1",
        }),
        [searchParams],
    );

    //** Effects */
    useEffect(() => {
        getStaff();
        getShifts();
    }, [getStaff, getShifts]);

    useEffect(() => {
        getReport();
    }, [getReport, currentSearch]);

    return (
        <Table
            className={twMerge(
                "[&>.tableContainer]:h-[85vh]",
                "[&_.bodyCell]:border-b [&_.bodyCell]:border-primary",
            )}
            loading={isLoading}
            rows={reports}
            columns={ReportColumns()}
            topContent={<TopContent />}
            paginationMode={{
                total: reportPagination?.total,
                page: reportPagination?.page,
                rowsPerPage: reportPagination?.rowsPerPage,
                onChange: page => {
                    router.push(convertObjectToSearchQuery({ ...currentSearch, page }));
                },
            }}
        />
    );
}

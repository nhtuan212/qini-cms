"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TargetColumn from "./TargetColumn";
import TargetTopContent from "./TargetTopContent";
import Table from "@/components/Table";
import { useShiftStore } from "@/stores/useShiftsStore";
import { twMerge } from "tailwind-merge";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTargetStore } from "@/stores/useTargetStore";
import { convertObjectToSearchQuery, snakeCaseQueryString } from "@/utils";

export default function Target() {
    const router = useRouter();
    const searchParams = useSearchParams();

    //** Stores */
    const { isLoading: isLoadingTarget, targets, targetPagination, getTarget } = useTargetStore();
    const { isLoading: isLoadingShift, getShifts } = useShiftStore();
    const { isLoading: isLoadingStaff, getStaff } = useStaffStore();

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
        getShifts();
        getStaff();
    }, [getShifts, getStaff]);

    useEffect(() => {
        const params = snakeCaseQueryString(searchParams);

        getTarget(params);
    }, [searchParams, getTarget]);

    //** Render */
    return (
        <Table
            className={twMerge(
                "[&>.tableContainer]:h-[85vh]",
                "[&_.bodyCell]:border-b [&_.bodyCell]:border-primary",
            )}
            loading={isLoadingTarget || isLoadingShift || isLoadingStaff}
            rows={targets}
            columns={TargetColumn()}
            topContent={<TargetTopContent />}
            paginationMode={{
                total: targetPagination?.total,
                page: targetPagination?.page,
                rowsPerPage: targetPagination?.rowsPerPage,
                onChange: page => {
                    router.push(convertObjectToSearchQuery({ ...currentSearch, page }));
                },
            }}
        />
    );
}

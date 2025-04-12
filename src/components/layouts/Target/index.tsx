"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TargetColumn from "./TargetColumn";
import TargetTopContent from "./TargetTopContent";
import Table from "@/components/Table";
import { useShiftStore } from "@/stores/useShiftsStore";
import { twMerge } from "tailwind-merge";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTargetStore } from "@/stores/useTargetStore";
import { snakeCaseQueryString } from "@/utils";

export default function Target() {
    const searchParams = useSearchParams();

    //** Stores */
    const { isLoading: isLoadingTarget, targets, getTarget } = useTargetStore();
    const { isLoading: isLoadingShift, getShifts } = useShiftStore();
    const { isLoading: isLoadingStaff, getStaff } = useStaffStore();

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
        />
    );
}

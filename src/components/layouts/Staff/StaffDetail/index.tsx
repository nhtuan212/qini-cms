"use client";

import React, { useEffect } from "react";
import Table from "@/components/Table";
import useStaffDetailColumns from "./UseStaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { formatDate, getDateTime } from "@/utils";
import { useStaffStore } from "@/stores/useStaffStore";

export default function StaffModalDetail() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { isLoading, timeSheetByStaffId, getTimeSheet } = useTimeSheetStore();

    //** Effects */
    useEffect(() => {
        getTimeSheet({
            staffId: staffById?.id,
            startDate: formatDate(getDateTime().firstDayOfMonth.toString(), "YYYY-MM-DD"),
            endDate: formatDate(new Date(), "YYYY-MM-DD"),
        });
    }, [getTimeSheet, staffById]);

    //** Render */
    return (
        <Table
            className="[&>.tableContainer]:h-[40rem]"
            columns={useStaffDetailColumns()}
            rows={timeSheetByStaffId}
            loading={isLoading}
            topContent={<StaffDetailTopContent />}
        />
    );
}

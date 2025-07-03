"use client";

import React, { useEffect } from "react";
import Table from "@/components/Table";
import useStaffDetailColumns from "./UseStaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { formatDate, getDateTime } from "@/utils";

export default function StaffModalDetail({ staff }: { staff?: StaffProps }) {
    //** Stores */
    const { staffById, getStaffById } = useStaffStore();
    const { isLoading, timeSheetByStaffId, getTimeSheet } = useTimeSheetStore();

    //** Effects */
    useEffect(() => {
        getTimeSheet({
            staffId: staffById?.id,
            startDate: formatDate(getDateTime().firstDayOfMonth.toString(), "YYYY-MM-DD"),
            endDate: formatDate(new Date(), "YYYY-MM-DD"),
        });
    }, [getTimeSheet, staffById]);

    useEffect(() => {
        if (staff) {
            getStaffById(staff.id);
        }
    }, [getStaffById, staff]);

    //** Render */
    return (
        <Table
            className="[&>.tableContainer]:h-[40rem]"
            columns={useStaffDetailColumns()}
            rows={timeSheetByStaffId.data}
            loading={isLoading}
            topContent={<StaffDetailTopContent />}
        />
    );
}

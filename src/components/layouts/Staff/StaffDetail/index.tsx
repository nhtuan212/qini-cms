"use client";

import React, { useEffect } from "react";
import Table from "@/components/Table";
import useStaffDetailColumns from "./useStaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { formatDate, getDateTime } from "@/utils";

export default function StaffModalDetail({ staff }: { staff?: StaffProps }) {
    //** Stores */
    const { staffById, getStaffById } = useStaffStore();
    const { isLoading, timeSheetByStaffId, getTimeSheetByStaffId } = useTimeSheetStore();

    //** Effects */
    useEffect(() => {
        if (staff) {
            getStaffById(staff.id);
        }
    }, [getStaffById, staff]);

    useEffect(() => {
        if (staffById?.id) {
            getTimeSheetByStaffId(staffById?.id, {
                startDate: formatDate(getDateTime().firstDayOfMonth.toString(), "YYYY-MM-DD"),
                endDate: formatDate(new Date(), "YYYY-MM-DD"),
            });
        }
    }, [getTimeSheetByStaffId, staffById]);

    //** Render */
    return (
        <Table
            columns={useStaffDetailColumns()}
            rows={timeSheetByStaffId.data}
            loading={isLoading}
            topContent={<StaffDetailTopContent />}
        />
    );
}

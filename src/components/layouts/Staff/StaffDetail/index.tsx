"use client";

import React from "react";
import Table from "@/components/Table";
import useStaffDetailColumns from "./UseStaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";

export default function StaffModalDetail() {
    //** Stores */
    const { isLoading, timeSheetByStaffId } = useTimeSheetStore();

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

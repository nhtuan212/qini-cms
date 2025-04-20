"use client";

import React from "react";
import Table from "@/components/Table";
import StaffDetailColumns from "./StaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import { useTargetStaffStore } from "@/stores/useTargetStaffStore";

export default function StaffModalDetail() {
    //** Stores */
    const { isLoading, targetByStaffId } = useTargetStaffStore();

    //** Render */
    return (
        <Table
            className="[&>.tableContainer]:h-[40rem]"
            columns={StaffDetailColumns()}
            rows={targetByStaffId.shifts}
            loading={isLoading}
            topContent={<StaffDetailTopContent />}
        />
    );
}

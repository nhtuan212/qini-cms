"use client";

import React from "react";
import Table from "@/components/Table";
import StaffDetailColumns from "./StaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";

export default function StaffModalDetail() {
    //** Stores */
    const { isLoading, reportsOnStaff } = useReportsOnStaffsStore();

    //** Render */
    return (
        <Table
            className="[&>.tableContainer]:h-[40rem]"
            columns={StaffDetailColumns()}
            rows={reportsOnStaff}
            loading={isLoading}
            topContent={<StaffDetailTopContent />}
        />
    );
}

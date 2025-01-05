"use client";

import React from "react";
import StaffDetailColumns from "./StaffDetailColumns";
import StaffDetailTopContent from "./StaffDetailTopContent";
import Table from "@/components/Table";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";

export default function StaffModalDetail() {
    //** Stores */
    const { reportsOnStaff, isLoading } = useReportsOnStaffsStore();

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

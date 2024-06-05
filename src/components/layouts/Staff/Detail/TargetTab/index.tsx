"use client";

import React from "react";
import Table from "@/components/Table";
import TargetColumns from "./TargetColumns";
import TargetTopContent from "./TargetTopContent";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";

export default function TargetTab() {
    //** Stores */
    const { reportsOnStaff, isReportsOnStaffLoading } = useReportsOnStaffsStore();

    return (
        <Table
            className="[&>.tableContainer]:h-[40rem]"
            columns={TargetColumns()}
            rows={reportsOnStaff}
            loading={isReportsOnStaffLoading}
            topContent={<TargetTopContent />}
            paginationMode={{ pageSize: 50, pageSizeOptions: [50, 60] }}
        />
    );
}

"use client";

import React from "react";
import Table from "@/components/Table";
import TargetColumns from "./TargetColumns";
import TargetTopContent from "./TargetTopContent";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";

export default function TargetTab() {
    //** Stores */
    const { reportByStaff } = useReportsOnStaffsStore();

    return (
        <Table
            columns={TargetColumns()}
            rows={reportByStaff}
            topContent={<TargetTopContent />}
            paginationMode={{ pageSize: 10, pageSizeOptions: [5, 10] }}
        />
    );
}

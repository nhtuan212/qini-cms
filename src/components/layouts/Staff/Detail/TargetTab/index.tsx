"use client";

import React from "react";
import Table from "@/components/Table";
import TargetColumns from "./TargetColumns";
import TargetTopContent from "./TargetTopContent";
import { useReportStore } from "@/stores/useReportStore";

export default function TargetTab() {
    //** Stores */
    const { reportByStaff } = useReportStore();

    return (
        <Table
            columns={TargetColumns()}
            rows={reportByStaff}
            topContent={<TargetTopContent />}
            isCheckedList
            isPagination
            pageSize={5}
            rowsPerPage={[5, 15]}
        />
    );
}

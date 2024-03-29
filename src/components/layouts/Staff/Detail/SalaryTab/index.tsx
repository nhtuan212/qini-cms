"use client";

import React from "react";
import Table from "@/components/Table";
import SalaryColumns from "./SalaryColumns";
import StaffDetailTopContent from "../TargetTab/TargetTopContent";
import { useReportStore } from "@/stores/useReportStore";

export default function SalaryTab() {
    //** Stores */
    const { reportByStaff } = useReportStore();

    return (
        <Table
            columns={SalaryColumns()}
            rows={reportByStaff}
            topContent={<StaffDetailTopContent />}
            selectionMode
            paginationMode={{ pageSize: 10, pageSizeOptions: [5, 10] }}
        />
    );
}

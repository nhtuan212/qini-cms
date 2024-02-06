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
            isCheckedList
            isPagination
            pageSize={5}
            rowsPerPage={[5, 10, 15]}
        />
    );
}

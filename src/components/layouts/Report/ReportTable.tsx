"use client";

import React from "react";
import Table from "@/components/Table";
import ReportColumns from "./ReportColumns";
import ReportAddNew from "./ReportAddNew";
import { rows } from "@/components/Table/apis";

export default function ReportTable() {
    return (
        <>
            <Table
                columns={ReportColumns()}
                rows={rows}
                isCheckedList
                isPagination
                rowsPerPage={[5, 10]}
            />

            {/* Add new content */}
            <ReportAddNew />
        </>
    );
}

"use client";

import React from "react";
import Table from "@/components/Table";
import ReportColumns from "./ReportColumns";
import { rows } from "@/components/Table/apis";
import AddNew from "./AddNew";

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
            <AddNew />
        </>
    );
}

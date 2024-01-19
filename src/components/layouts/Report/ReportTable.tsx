"use client";

import React from "react";
// import dynamic from "next/dynamic";

// const Table2 = dynamic(() => import("@/components/Table2"), {
//     ssr: true,
// });

import { columns, rows } from "@/components/Table2/apis";
import Table from "@/components/Table";

export default function ReportTable() {
    return (
        <>
            <Table
                columns={columns}
                rows={rows}
                isCheckedList
                isPagination
                rowsPerPage={[5, 10]}
            />
            {/* <Table2
                // hideHeader
                columns={columns}
                rows={rows}
                isSortable
                // isPagination
                aria-label="Example table with client side sorting"
            /> */}
        </>
    );
}

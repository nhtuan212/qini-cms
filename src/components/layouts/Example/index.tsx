"use client";

import React from "react";
import Table from "@/components/Table";
import Columns from "./columns";
import { rows } from "@/components/Table/apis";

export default function index() {
    return (
        <Table
            columns={Columns()}
            rows={rows}
            selectionMode
            paginationMode={{ pageSize: 5, pageSizeOptions: [5, 10] }}
        />
    );
}

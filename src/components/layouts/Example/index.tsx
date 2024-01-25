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
            isCheckedList
            isPagination
            pageSize={5}
            rowsPerPage={[5, 10]}
        />
    );
}

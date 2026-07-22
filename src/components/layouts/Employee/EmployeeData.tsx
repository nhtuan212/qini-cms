"use client";

import useEmployeeColumns from "./useEmployeeColumns";
import Table from "@/components/Table";
import { EmployeeProps } from "@/types";

export default function EmployeeData({ data }: { data: EmployeeProps[] }) {
    //** Render */
    return (
        <Table columns={useEmployeeColumns()} rows={data} pinnedColumns={{ right: ["actions"] }} />
    );
}

"use client";

import React from "react";
import Table from "./Table";
import TableProvider from "./TableProvider";

export type TableProps = {
    loading?: boolean;
    className?: string;
    columns: any;
    rows: any;
    selectionMode?: boolean;
    sortingMode?: boolean;
    columnVisibility?: { [key: string]: boolean };
    paginationMode?: any;
    pinnedColumns?: {
        left?: string[];
        right?: string[];
    };
    rowSelection?: readonly string[] | readonly number[];
    onRowSelection?: (e: readonly string[] | readonly number[]) => void;
    topContent?: React.ReactNode;
};

export default function TableContext({ ...props }: TableProps) {
    return (
        <TableProvider>
            <Table {...props} />
        </TableProvider>
    );
}

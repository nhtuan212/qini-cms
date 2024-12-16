"use client";

import React from "react";
import Table from "./Table";
import TableProvider from "./TableProvider";
import { PaginationProps } from "@nextui-org/react";

export type TableProps = {
    loading?: boolean;
    className?: string;
    columns: any;
    rows: any;
    selectionMode?: boolean;
    sortingMode?: boolean;
    columnVisibility?: { [key: string]: boolean };
    paginationMode?: {
        rowsPerPage: number;
    } & PaginationProps;
    pinnedColumns?: {
        left?: string[];
        right?: string[];
    };
    allowsSorting?: boolean;
    rowSelection?: readonly string[] | readonly number[];
    topContent?: React.ReactNode;
    bottomContent?: React.ReactNode;
    onRowSelection?: (e: readonly string[] | readonly number[]) => void;
};

export default function TableContext({ ...props }: TableProps) {
    return (
        <TableProvider>
            <Table {...props} />
        </TableProvider>
    );
}

"use client";

import React, { createContext, useState } from "react";

export type tableRowsProps = {
    items: any[];
    sortDescriptor?: { [key: string]: string };
};

type TableContextType = {
    // Rows, Columns
    rows: tableRowsProps;
    columns: any[];
    handleColumns: (value: any[]) => void;
    handleRows: ({ items, sortDescriptor }: tableRowsProps) => void;

    // Selection
    isSelectionMode?: boolean;
    handleSelectionMode: (value?: boolean) => void;

    // Checked
    itemList: readonly number[];
    isAllChecked?: boolean;
    handleCheckedItem: (value: readonly number[]) => void;
    handleCheckedAll: (checked: boolean) => void;

    // Pagination
    currentPage: number;
    rowsPerPage: number;
    handleCurrentPage: (value: number) => void;
    handleRowsPerPage: (value: number) => void;

    // Pinned
    pinnedColumns?: {
        left?: string[];
        right?: string[];
    };
    handlePinnedColumns?: (value: { left?: string[]; right?: string[] }) => void;

    // SelectionModeChange
    handleSelectionModeChange?: (e: readonly string[] | readonly number[]) => void;
};

export const TableContext = createContext<TableContextType>({
    // Rows, Columns
    rows: { items: [], sortDescriptor: {} },
    columns: [],
    handleRows: () => {},
    handleColumns: () => {},

    // Selection
    isSelectionMode: false,
    handleSelectionMode: () => {},

    // Checked
    itemList: [],
    isAllChecked: false,
    handleCheckedItem: () => {},
    handleCheckedAll: () => {},

    // Pagination
    currentPage: 1,
    rowsPerPage: 5,
    handleCurrentPage: () => {},
    handleRowsPerPage: () => {},

    // Pinned
    pinnedColumns: { left: [], right: [] },
    handlePinnedColumns: () => {},
});

export default function TableProvider({ children }: { children: React.ReactNode }) {
    //** States */
    // Rows, Columns
    const [rows, setRows] = useState<tableRowsProps>({ items: [], sortDescriptor: {} });
    const [columns, setColumns] = useState<any[]>([]);

    // Selection
    const [isSelectionMode, setIsSelectionMode] = useState<boolean | undefined>(false);

    // Checked
    const [itemList, setItemList] = useState<readonly number[]>([]);
    const [isAllChecked, setIsAllChecked] = useState(false);

    // Pagination
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Pinned
    const [pinnedColumns, setPinnedColumns] = useState<{ left?: string[]; right?: string[] }>({});

    //** Functions */
    // Rows, Columns
    const handleRows = (rows: tableRowsProps) => {
        setRows(rows);
    };

    const handleColumns = (columns: any[]) => {
        setColumns(columns);
    };

    // Selection
    const handleSelectionMode = (value?: boolean) => {
        setIsSelectionMode(value);
    };

    // Checked
    const handleCheckedItem = (value: readonly number[]) => {
        setItemList(value);
    };

    const handleCheckedAll = (checked: boolean) => {
        setIsAllChecked(checked);
    };

    // Pagination
    const handleCurrentPage = (value: number) => {
        setCurrentPage(value);
    };

    const handleRowsPerPage = (value: number) => {
        setRowsPerPage(value);
    };

    // Pinned
    const handlePinnedColumns = (value: { left?: string[]; right?: string[] }) => {
        setPinnedColumns(value);
    };

    //** Variables */
    const valueContext = {
        // Rows, Columns
        rows,
        columns,
        handleRows,
        handleColumns,

        // Selection
        isSelectionMode,
        handleSelectionMode,

        // Checked
        itemList,
        isAllChecked,
        handleCheckedItem,
        handleCheckedAll,

        // Pagination
        currentPage,
        rowsPerPage,
        handleCurrentPage,
        handleRowsPerPage,

        // Pinned
        pinnedColumns,
        handlePinnedColumns,
    };

    return <TableContext.Provider value={valueContext}>{children}</TableContext.Provider>;
}

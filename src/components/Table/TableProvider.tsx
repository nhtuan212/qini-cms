"use client";
import React, { createContext, useState } from "react";
export type tableRowsProps = {
    items: any[];
    sortDescriptor?: { [key: string]: string };
};
type TableContextType = {
    // Rows, Columns
    setRows: ({ items, sortDescriptor }: tableRowsProps) => void;
    setColumns: (items: any[]) => void;
    rows: tableRowsProps;
    columns: any[];

    // Selection
    setIsSelectionMode: (value?: boolean) => void;
    isSelectionMode?: boolean;

    // Checked
    setIsAllChecked: (value: boolean) => void;
    setItemList: (value: readonly number[]) => void;
    isAllChecked?: boolean;
    itemList: readonly number[];

    // Pagination
    setCurrentPage: (value: number) => void;
    setRowsPerPage: (value: number) => void;
    currentPage: number;
    rowsPerPage: number;

    // Pinned
    setPinnedColumns?: (value: { left?: string[]; right?: string[] }) => void;
    pinnedColumns?: {
        left?: string[];
        right?: string[];
    };
};
export const TableContext = createContext<TableContextType>({
    // Rows, Columns
    setRows: () => {},
    setColumns: () => {},
    rows: { items: [], sortDescriptor: {} },
    columns: [],

    // Selection
    setIsSelectionMode: () => {},
    isSelectionMode: false,

    // Checked
    setIsAllChecked: () => {},
    setItemList: () => {},
    itemList: [],
    isAllChecked: false,

    // Pagination
    currentPage: 1,
    rowsPerPage: 5,
    setCurrentPage: () => {},
    setRowsPerPage: () => {},

    // Pinned
    pinnedColumns: { left: [], right: [] },
    setPinnedColumns: () => {},
});
export default function TableProvider({ children }: { children: React.ReactNode }) {
    //** States */
    // Rows, Columns
    const [rows, setRows] = useState<tableRowsProps>({ items: [], sortDescriptor: {} });
    const [columns, setColumns] = useState<any[]>([]);

    // Selection
    const [isSelectionMode, setIsSelectionMode] = useState<boolean | undefined>(false);

    // Checked
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [itemList, setItemList] = useState<readonly number[]>([]);

    // Pagination
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Pinned
    const [pinnedColumns, setPinnedColumns] = useState<{ left?: string[]; right?: string[] }>({});

    //** Variables */
    const valueContext = {
        // Rows, Columns
        setRows,
        setColumns,
        rows,
        columns,

        // Selection
        setIsSelectionMode,
        isSelectionMode,

        // Checked
        setIsAllChecked,
        setItemList,
        itemList,
        isAllChecked,

        // Pagination
        setCurrentPage,
        setRowsPerPage,
        currentPage,
        rowsPerPage,

        // Pinned
        setPinnedColumns,
        pinnedColumns,
    };
    return <TableContext.Provider value={valueContext}>{children}</TableContext.Provider>;
}

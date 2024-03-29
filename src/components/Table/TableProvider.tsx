"use client";

import React, { createContext, useState } from "react";

type TableContextType = {
    isAllChecked?: boolean;
    itemList: readonly number[];

    handleCheckedItem: (value: readonly number[]) => void;
    handleCheckedAll: (checked: boolean) => void;

    // Pagination
    currentPage: number;
    rowsPerPage: number;
    handleCurrentPage: (value: number) => void;
    handleRowsPerPage: (value: number) => void;
};

export const TableContext = createContext<TableContextType>({
    isAllChecked: false,
    itemList: [],

    handleCheckedItem: () => {},
    handleCheckedAll: () => {},

    // Pagination
    currentPage: 1,
    rowsPerPage: 5,
    handleCurrentPage: () => {},
    handleRowsPerPage: () => {},
});

export default function TableProvider({ children }: { children: React.ReactNode }) {
    //** States */
    const [itemList, setItemList] = useState<readonly number[]>([]);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    //** Functions */
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

    //** Variables */
    const valueContext = {
        isAllChecked,
        itemList,

        handleCheckedItem,
        handleCheckedAll,

        // Pagination
        currentPage,
        rowsPerPage,
        handleCurrentPage,
        handleRowsPerPage,
    };

    return <TableContext.Provider value={valueContext}>{children}</TableContext.Provider>;
}

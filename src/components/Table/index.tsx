"use client";

import React, { useEffect, useMemo } from "react";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import { useTableStore } from "@/stores/useTableStore";
import Pagination from "../Pagination";
import RowsPerPage from "./RowsPerPage";
import { usePaginationStore } from "@/stores/usePaginationStore";

export default function Table({
    columns,
    rows,
    topContent,
    isCheckedList,
    isPagination,
    pageSize = 5,
    rowsPerPage,
}: {
    columns: any;
    rows: any;
    topContent?: React.ReactNode;
    isCheckedList?: boolean;
    isPagination?: boolean;
    pageSize?: number;
    rowsPerPage?: number[];
}) {
    //** Store */
    const {
        checked,
        getPageSize,
        filterValue,

        setPageSize,
        allCheckedStore,
        checkedStore,
        resetTableStore,
    } = useTableStore();

    const { currentPage } = usePaginationStore();

    //** Variables */
    const filteredItems = useMemo(() => {
        if (!rows || !rows.length) return [];

        return rows.filter((row: any) => {
            return Object.values(row).some((value: any) => {
                if (typeof value === "string") {
                    return value.toLowerCase().includes(filterValue.toLowerCase());
                }
                return false;
            });
        });
    }, [filterValue, rows]);

    const items = useMemo(() => {
        const start = (currentPage - 1) * getPageSize;
        const end = start + getPageSize;

        // return isPagination ? rows.slice(start, end) : filteredItems;
        return filteredItems.slice(start, end);
    }, [currentPage, getPageSize, filteredItems]);

    // Empty rows
    const emptyRows = currentPage > 0 ? Math.max(0, currentPage * getPageSize - rows.length) : 0;

    //** Functions */
    // isCheckedList
    const handleAllChecked = (checked: boolean) => {
        if (checked) {
            const newChecked = rows.map((n: any) => n.id);
            allCheckedStore(true);
            return checkedStore(newChecked);
        }
        allCheckedStore(false);
        checkedStore([]);
    };

    //** Effects */
    useEffect(() => {
        // get page size
        pageSize && setPageSize(pageSize);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Clear all checked when unmount
        return () => {
            resetTableStore();
        };
    }, [resetTableStore]);

    return (
        <div className="rounded-md p-3 border shadow-lg">
            {topContent && topContent}
            {rowsPerPage && <RowsPerPage pageSize={pageSize} rowsPerPage={rowsPerPage} />}
            <div className="flex flex-col w-full">
                <TableHead
                    columns={columns}
                    rowsLength={rows.length}
                    isCheckedList={isCheckedList}
                    onCheckedAll={handleAllChecked}
                />
                <TableBody
                    columns={columns}
                    rows={items}
                    emptyRows={emptyRows}
                    checked={checked}
                    isCheckedList={isCheckedList}
                />
            </div>
            {isPagination && (
                <Pagination totalPage={Math.ceil(filteredItems.length / getPageSize)} />
            )}
        </div>
    );
}

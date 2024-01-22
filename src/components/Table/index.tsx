"use client";

import React, { useEffect, useMemo } from "react";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import { useTableStore } from "@/stores/useTableStore";
import Pagination from "../Pagination";
import RowsPerPage from "./RowsPerPage";
import { usePaginationStore } from "@/stores/usePaginationStore";
import TopContent from "./TopContent";

export default function Table({
    columns,
    rows,
    isCheckedList,
    isPagination,
    rowsPerPage,
}: {
    columns: any;
    rows: any;
    isCheckedList?: boolean;
    isPagination?: boolean;
    rowsPerPage?: number[];
}) {
    //** Store */
    const {
        checked,
        pageSize,
        allCheckedStore,
        checkedStore,
        clearTableStore,

        filterValue,
    } = useTableStore();

    const { currentPage } = usePaginationStore();

    //** Variables */
    const filteredItems = useMemo(() => {
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
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;

        // return isPagination ? rows.slice(start, end) : filteredItems;
        return filteredItems.slice(start, end);
    }, [currentPage, pageSize, filteredItems]);

    // Empty rows
    const emptyRows = currentPage > 0 ? Math.max(0, currentPage * pageSize - rows.length) : 0;

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
        // Clear all checked when unmount
        return () => {
            clearTableStore();
        };
    }, [clearTableStore]);

    return (
        <div className="rounded-md p-3 border shadow-lg">
            <TopContent />
            <RowsPerPage rowsPerPage={rowsPerPage} />
            <table className="table-auto">
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
            </table>
            {isPagination && <Pagination totalPage={Math.ceil(filteredItems.length / pageSize)} />}
        </div>
    );
}

"use client";

import React, { useContext, useEffect, useMemo } from "react";
import clsx from "clsx";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { TableProps } from ".";
import { TableContext } from "./TableProvider";

export default function Table({ ...props }: TableProps) {
    //** Destructuring */
    const {
        loading,
        className,
        columns,
        rows,
        topContent,
        selectionMode,
        sortingMode,
        columnVisibility,
        paginationMode,
        pinnedColumns,
        rowSelection,
        onRowSelection,
    } = props;

    //** Context */
    const { handleRows, handleColumns, handleSelectionMode, handlePinnedColumns } =
        useContext(TableContext);

    //** Variables */
    const columnFiltered = useMemo(
        () =>
            columns
                ?.map((column: any) => {
                    return {
                        visible:
                            columnVisibility && columnVisibility[column.key] === false
                                ? columnVisibility[column.key]
                                : true,
                        ...column,
                    };
                })
                .filter((column: any) => column.visible),
        [columns, columnVisibility],
    );

    //** Functions */
    const isEmpty = (obj: {}) => {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }

        return true;
    };

    //** Effects */
    useEffect(() => {
        //** Handle Rows */
        handleRows({
            items: rows,
            sortDescriptor: {},
        });

        // eslint-disable-next-line
    }, [rows]);

    //** Effects */
    useEffect(() => {
        //** Handle  Columns */
        handleColumns(columnFiltered);
    }, [handleColumns, columnFiltered]);

    useEffect(() => {
        //** Handle Selection Mode */
        typeof handleSelectionMode === "function" && handleSelectionMode(selectionMode);
    }, [handleSelectionMode, selectionMode]);

    useEffect(() => {
        //** Pinned columns */
        typeof handlePinnedColumns === "function" &&
            !isEmpty(pinnedColumns || {}) &&
            handlePinnedColumns(pinnedColumns || {});
    }, [handlePinnedColumns, pinnedColumns]);

    return (
        <div className={clsx("rounded-md p-3 border shadow-lg", className)}>
            <div className="w-full h-full flex flex-col">
                {topContent && topContent}
                <div className="h-full overflow-scroll">
                    <TableHead sortingMode={sortingMode} onRowSelection={onRowSelection} />
                    <TableBody
                        loading={loading}
                        onRowSelection={onRowSelection}
                        rowSelection={rowSelection}
                    />
                </div>
            </div>
            {!isEmpty(paginationMode) && rows.length && (
                <Pagination rows={rows} {...paginationMode} />
            )}
        </div>
    );
}

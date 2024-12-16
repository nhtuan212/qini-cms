"use client";

import React, { useContext, useEffect, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import TablePagination from "./TablePagination";
import { TableProps } from ".";
import { TableContext } from "./TableProvider";

export default function Table({ ...props }: TableProps) {
    const ref = useRef<HTMLDivElement>(null);

    //** Destructuring */
    const {
        loading,
        className,
        columns,
        rows,
        topContent,
        bottomContent,
        selectionMode,
        sortingMode,
        columnVisibility,
        paginationMode,
        pinnedColumns,
        rowSelection,
        onRowSelection,
    } = props;

    //** Context */
    const { setRows, setColumns, setIsSelectionMode, setPinnedColumns } = useContext(TableContext);

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
    const isEmpty = (obj: object | undefined) => {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    };

    //** Effects */
    useEffect(() => {
        //** Rows */
        setRows({
            items: rows,
            sortDescriptor: {},
        });

        // Scroll to top when rows change
        ref.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [setRows, rows, ref]);

    useEffect(() => {
        //** Columns */
        setColumns(columnFiltered);
    }, [setColumns, columnFiltered]);

    useEffect(() => {
        //** Selection Mode */
        selectionMode && setIsSelectionMode(selectionMode);
    }, [setIsSelectionMode, selectionMode]);

    useEffect(() => {
        //** Pinned columns */
        setPinnedColumns && !isEmpty(pinnedColumns || {}) && setPinnedColumns(pinnedColumns || {});
    }, [setPinnedColumns, pinnedColumns]);

    //** Render */
    return (
        <div className={twMerge("relative rounded-md p-3 shadow-md", className)}>
            <div className="tableContainer min-h-[38rem] flex flex-col gap-4">
                {topContent && topContent}

                <div className="overflow-scroll" ref={ref}>
                    <TableHead sortingMode={sortingMode} onRowSelection={onRowSelection} />
                    <TableBody
                        loading={loading}
                        onRowSelection={onRowSelection}
                        rowSelection={rowSelection}
                    />
                </div>

                <div className="flex justify-between items-center">
                    {bottomContent && <div className="flex-1">{bottomContent}</div>}

                    <div className="flex-1">
                        {!isEmpty(paginationMode) && !!rows.length && (
                            <TablePagination
                                {...(paginationMode as TableProps["paginationMode"] & object)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

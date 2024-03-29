"use client";

import React, { useMemo } from "react";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import TableProvider from "./TableProvider";
import Pagination from "./Pagination";

export default function Table({
    columns,
    rows,
    columnVisibility,
    selectionMode,
    paginationMode,
    pinnedColumns,
    onRowSelectionModeChange,
    rowSelectionMode,
    topContent,
}: {
    columns: any;
    rows: any;
    selectionMode?: boolean;
    columnVisibility?: { [key: string]: boolean };
    paginationMode?: any;
    pinnedColumns?: {
        left?: string[];
        right?: string[];
    };
    onRowSelectionModeChange?: (e: readonly string[] | readonly number[]) => void;
    rowSelectionMode?: readonly string[] | readonly number[];
    topContent?: React.ReactNode;
}) {
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

    return (
        <TableProvider>
            <div className="rounded-md p-3 border shadow-lg">
                <div className="h-[30rem] flex flex-col w-full">
                    {topContent && topContent}
                    <div className="h-full overflow-scroll">
                        <TableHead
                            columns={columnFiltered}
                            rows={rows}
                            selectionMode={selectionMode}
                            pinnedColumns={pinnedColumns}
                            onRowSelectionModeChange={onRowSelectionModeChange}
                        />
                        <TableBody
                            columns={columnFiltered}
                            rows={rows}
                            selectionMode={selectionMode}
                            pinnedColumns={pinnedColumns}
                            onRowSelectionModeChange={onRowSelectionModeChange}
                            rowSelectionMode={rowSelectionMode}
                        />
                    </div>
                </div>
                {!isEmpty(paginationMode) && <Pagination rows={rows} {...paginationMode} />}
            </div>
        </TableProvider>
    );
}

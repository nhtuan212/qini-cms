"use client";

import React, { useContext, useEffect, useMemo } from "react";
import clsx from "clsx";
import Checkbox from "../Checkbox";
import { TableContext } from "./TableProvider";

export default function TableBody({
    rows,
    columns,
    selectionMode,
    pinnedColumns,
    onRowSelectionModeChange,
    rowSelectionMode,
}: {
    rows: any;
    columns: any;
    selectionMode?: boolean;
    pinnedColumns?: {
        left?: string[];
        right?: string[];
    };
    onRowSelectionModeChange?: (e: readonly string[] | readonly number[]) => void;
    rowSelectionMode?: readonly string[] | readonly number[];
}) {
    //** Context */
    const { itemList, currentPage, rowsPerPage, handleCheckedItem, handleCheckedAll } =
        useContext(TableContext);

    //** Variables */
    const isChecked = (id: number): boolean => itemList?.indexOf(id) !== -1;

    const items = useMemo(() => {
        const start = currentPage - 1;
        const end = start + rowsPerPage;

        return rows.slice(start, end);
    }, [currentPage, rows, rowsPerPage]);

    const pinnedColumnsLeft = useMemo(() => {
        return columns?.filter((column: any) => pinnedColumns?.left?.includes(column.key));
    }, [columns, pinnedColumns]);

    const dataColumn = useMemo(() => {
        return columns?.filter((column: any) => !pinnedColumns?.left?.includes(column.key));
    }, [columns, pinnedColumns]);

    //** Functions */
    const handleChecked = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const idChecked = itemList?.indexOf(id);
        let newChecked: readonly number[] = [];

        if (idChecked === -1) {
            //** idChecked not contain in newChecked */
            newChecked = newChecked.concat(itemList, id);
        } else if (idChecked === 0) {
            //** unchecked last idChecked has contain in newChecked */
            newChecked = newChecked.concat(itemList.slice(1));
        } else if (idChecked === itemList.length - 1) {
            //** unchecked last idChecked has contain in newChecked when full length */
            newChecked = newChecked.concat(itemList.slice(0, -1));
        } else if (idChecked > 0) {
            //** unchecked idChecked any where has contain in newChecked */
            newChecked = newChecked.concat(
                itemList.slice(0, idChecked),
                itemList.slice(idChecked + 1),
            );
        }

        typeof handleCheckedItem === "function" && handleCheckedItem(newChecked);

        typeof handleCheckedAll === "function" &&
            handleCheckedAll(newChecked.length === rows.length);

        typeof onRowSelectionModeChange === "function" && onRowSelectionModeChange(newChecked);
    };

    const renderSelectionMode = (id: number) => {
        if (selectionMode) {
            return (
                <div className="flex items-center px-3 py-2">
                    <Checkbox
                        checked={isChecked(id)}
                        onChange={e => {
                            handleChecked(e, id);
                        }}
                    />
                </div>
            );
        }

        return null;
    };

    const renderColumn = (column: any, row: any) => {
        return (
            <div key={column.key} className={clsx("flex-1 px-3 py-2 text-sm", column.className)}>
                {typeof column.content === "function" &&
                    column.content({
                        row,
                        key: column.key,
                        name: column.name,
                    })}
            </div>
        );
    };

    //** Effects */
    useEffect(() => {
        //** Checked item in rowSelectionMode */
        if (Array.isArray(rowSelectionMode)) {
            return handleCheckedItem(rowSelectionMode);
        }
    }, [rowSelectionMode, handleCheckedItem]);

    return items.length > 0 ? (
        <div className="min-w-full w-fit">
            {items?.map((row: any, index: number) => {
                return (
                    <div
                        id={row.id}
                        key={`${row.id}-${index}`}
                        className={clsx(
                            "flex items-center rounded-md",
                            "even:bg-gray-50 hover:bg-gray-50",
                        )}
                    >
                        {pinnedColumns?.left && pinnedColumns?.left?.length > 0 && (
                            <div className="cellStickyLeft">
                                {pinnedColumns?.left?.includes("__Selection__") &&
                                    renderSelectionMode(row.id)}

                                {pinnedColumnsLeft.map((column: any) => renderColumn(column, row))}
                            </div>
                        )}

                        {!pinnedColumns?.left?.includes("__Selection__") &&
                            renderSelectionMode(row.id)}

                        {dataColumn.map((column: any) => renderColumn(column, row))}
                    </div>
                );
            })}
        </div>
    ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-400">
            No data available
        </div>
    );
}

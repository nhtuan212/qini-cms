"use client";

import React, { useContext, useMemo } from "react";
import clsx from "clsx";
import Checkbox from "../Checkbox";
import { TableContext } from "./TableProvider";

export default function TableHead({
    columns,
    rows,
    selectionMode,
    pinnedColumns,
    onRowSelectionModeChange,
}: {
    columns: any;
    rows: any[];
    selectionMode?: boolean;
    pinnedColumns?: {
        left?: string[];
        right?: string[];
    };
    onRowSelectionModeChange?: (e: readonly string[] | readonly number[]) => void;
}) {
    //** Context */
    const { isAllChecked, handleCheckedItem, handleCheckedAll } = useContext(TableContext);

    //** Variables */
    const pinnedColumnsLeft = useMemo(() => {
        return columns?.filter((column: any) => pinnedColumns?.left?.includes(column.key));
    }, [columns, pinnedColumns]);

    const dataColumn = useMemo(() => {
        return columns?.filter((column: any) => !pinnedColumns?.left?.includes(column.key));
    }, [columns, pinnedColumns]);

    //** Functions */
    const handleOnChange = (checkedAll: boolean) => {
        if (checkedAll) {
            //** Checked All */
            const newChecked = rows.map((row: any) => row.id);
            typeof handleCheckedAll === "function" && handleCheckedAll(true);
            typeof handleCheckedItem === "function" && handleCheckedItem(newChecked);
            typeof onRowSelectionModeChange === "function" && onRowSelectionModeChange(newChecked);
        } else {
            //** Unchecked All */
            typeof handleCheckedAll === "function" && handleCheckedAll(false);
            typeof handleCheckedItem === "function" && handleCheckedItem([]);
            typeof onRowSelectionModeChange === "function" && onRowSelectionModeChange([]);
        }
    };

    const renderSelectionMode = () => {
        if (selectionMode) {
            return (
                <div className="flex items-center px-3 py-2 font-semibold text-tiny">
                    <Checkbox
                        checked={isAllChecked}
                        onChange={e => handleOnChange(e.target.checked)}
                    />
                </div>
            );
        }

        return null;
    };

    const renderColumn = (column: any) => {
        return (
            <div
                key={column.key}
                className={clsx(
                    "flex-1 px-3 py-2 font-semibold text-capitalize text-tiny",
                    column.className,
                )}
            >
                {column.name}
            </div>
        );
    };

    return (
        <div className="sticky top-0 z-[100]">
            <div className="min-w-full w-fit flex items-center bg-gray-100 rounded-md">
                {/* {selectionMode &&
                    pinnedColumns?.left?.includes("__Selection__") &&
                    renderSelectionMode()}
                {columns.map((column: any) => renderColumn(column))} */}

                {pinnedColumns?.left && pinnedColumns?.left?.length > 0 && (
                    <div className="cellStickyLeft">
                        {pinnedColumns?.left?.includes("__Selection__") && renderSelectionMode()}

                        {pinnedColumnsLeft.map((column: any) => renderColumn(column))}
                    </div>
                )}

                {!pinnedColumns?.left?.includes("__Selection__") && renderSelectionMode()}

                {dataColumn.map((column: any) => renderColumn(column))}
            </div>
        </div>
    );
}

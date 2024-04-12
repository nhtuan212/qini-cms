"use client";

import React, { useContext, useEffect, useMemo } from "react";
import clsx from "clsx";
import Checkbox from "../Checkbox";
import { TableContext } from "./TableProvider";

type TableBodyProps = {
    loading?: boolean;
    rowSelection?: readonly string[] | readonly number[];
    onRowSelection?: (e: readonly string[] | readonly number[]) => void;
};

export default function TableBody({ ...props }: TableBodyProps) {
    //** Context */
    const {
        rows,
        columns,
        isSelectionMode,
        itemList,
        currentPage,
        rowsPerPage,
        pinnedColumns,
        handleCheckedItem,
        handleCheckedAll,
    } = useContext(TableContext);

    //** Destructuring */
    const { loading, onRowSelection, rowSelection } = props;

    //** Variables */
    const isChecked = useMemo(() => {
        return (id: number) => itemList?.indexOf(id) !== -1;
    }, [itemList]);

    const rowsData = useMemo(() => {
        if (rowsPerPage === 0) return rows.items;

        const start = currentPage - 1;
        const end = start + rowsPerPage;

        return rows.items.slice(start, end);
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
            handleCheckedAll(newChecked.length === rows.items.length);

        typeof onRowSelection === "function" && onRowSelection(newChecked);
    };

    const renderSelectionMode = (id: number) => {
        if (isSelectionMode) {
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
        //** Checked item in rowSelection */
        if (Array.isArray(rowSelection)) {
            return handleCheckedItem(rowSelection);
        }

        //eslint-disable-next-line
    }, [rowSelection]);

    if (rowsData.length === 0) {
        if (loading) {
            return (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <div
                        className={clsx(
                            "absolute top-0 left-0 z-[100]",
                            "w-full h-full",
                            "flex justify-center items-center",
                            "bg-white/50",
                        )}
                    >
                        <div
                            className={clsx(
                                "w-10 h-10 border-3 border-t-primary animate-spin rounded-full",
                            )}
                        ></div>
                    </div>
                </div>
            );
        }

        return (
            <div className="sticky left-0 flex items-center justify-center w-full h-full text-gray-400">
                No data available
            </div>
        );
    }

    return (
        <div className="min-w-full w-fit">
            {rowsData?.map((row: any, index: number) => {
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
    );
}

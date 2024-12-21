"use client";
import React, { useContext, useEffect, useMemo } from "react";
import { twMerge } from "tailwind-merge";
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
        setItemList,
        setIsAllChecked,
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

    const pinnedColumnsRight = useMemo(() => {
        return columns?.filter((column: any) => pinnedColumns?.right?.includes(column.key));
    }, [columns, pinnedColumns]);

    const dataColumn = useMemo(() => {
        return columns?.filter(
            (column: any) =>
                !pinnedColumns?.left?.includes(column.key) &&
                !pinnedColumns?.right?.includes(column.key),
        );
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
        typeof setItemList === "function" && setItemList(newChecked);
        typeof setIsAllChecked === "function" &&
            setIsAllChecked(newChecked.length === rows.items.length);
        typeof onRowSelection === "function" && onRowSelection(newChecked);
    };

    //** Effects */
    useEffect(() => {
        //** Checked item in rowSelection */
        if (Array.isArray(rowSelection)) {
            return setItemList(rowSelection);
        }
    }, [setItemList, rowSelection]);

    //** Render */
    const renderSelectionMode = (id: number) => {
        if (isSelectionMode) {
            return (
                <div className="flex items-center px-3 py-2">
                    <Checkbox
                        isSelected={isChecked(id)}
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
            <div
                key={column.key}
                className={twMerge("flex-1 min-w-36 px-3 py-2 text-sm", column.className)}
            >
                {typeof column.content === "function" &&
                    column.content({
                        row,
                        key: column.key,
                        name: column.name,
                    })}
            </div>
        );
    };
    const renderLoading = () => {
        return (
            <div
                className={twMerge(
                    "absolute top-0 left-0 w-full h-full flex items-center justify-center",
                    "bg-white bg-opacity-90 z-50",
                )}
            >
                <div className="w-16 h-16 border-t-2 border-b-2 border-gray-400 rounded-full animate-spin"></div>
            </div>
        );
    };

    if (rowsData && rowsData.length === 0) {
        return (
            <div className="relative w-full h-full min-h-96 flex items-center justify-center text-gray-400">
                {loading && renderLoading()}
                <div className="text-center">No data available</div>
            </div>
        );
    }

    return (
        <div className="min-w-full w-fit min-h-96">
            {loading && renderLoading()}
            {rowsData?.map((row: any, index: number) => {
                return (
                    <div
                        id={row.id}
                        key={`${row.id}-${index}`}
                        className={twMerge(
                            "bodyCell",
                            "flex items-center rounded-md",
                            "even:bg-gray-50",
                        )}
                    >
                        {!pinnedColumns?.left?.includes("__Selection__") &&
                            renderSelectionMode(row.id)}
                        {pinnedColumns?.left && pinnedColumns?.left?.length > 0 && (
                            <div className="cellStickyLeft">
                                {pinnedColumnsLeft.map((column: any) => renderColumn(column, row))}
                            </div>
                        )}
                        {dataColumn.map((column: any) => renderColumn(column, row))}
                        {pinnedColumns?.right && pinnedColumns?.right?.length > 0 && (
                            <div className="cellStickyRight">
                                {pinnedColumnsRight.map((column: any) => renderColumn(column, row))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

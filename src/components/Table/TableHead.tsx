"use client";
import React, { useContext, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import Checkbox from "../Checkbox";
import Button from "../Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { TableContext } from "./TableProvider";
type TableHeadProps = {
    sortingMode?: boolean;
    onRowSelection?: (e: readonly string[] | readonly number[]) => void;
};
export default function TableHead({ ...props }: TableHeadProps) {
    //** Context */
    const {
        columns,
        rows,
        isSelectionMode,
        isAllChecked,
        pinnedColumns,
        setRows,
        setItemList,
        setIsAllChecked,
    } = useContext(TableContext);
    //** Destructuring */
    const { sortingMode, onRowSelection } = props;
    const { items } = rows;
    //** States */
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({
        column: "",
        direction: "ascending",
    });
    //** Variables */
    const rowsData = useMemo(() => {
        if (sortDescriptor.column === "") return items;
        const dateTimeList = ["createAt", "updateAt"];
        return items.sort((a, b) => {
            const first = dateTimeList.includes(sortDescriptor.column)
                ? new Date(a[sortDescriptor.column])
                : a[sortDescriptor.column];
            const second = dateTimeList.includes(sortDescriptor.column)
                ? new Date(b[sortDescriptor.column])
                : b[sortDescriptor.column];
            let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;
            if (sortDescriptor.direction === "descending") {
                cmp *= -1;
            }
            return cmp;
        });
    }, [items, sortDescriptor]);
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
    const handleOnChange = (checkedAll: boolean) => {
        if (checkedAll) {
            //** Checked All */
            const newChecked = items.map((row: any) => row.id);
            typeof setIsAllChecked === "function" && setIsAllChecked(true);
            typeof setItemList === "function" && setItemList(newChecked);
            typeof onRowSelection === "function" && onRowSelection(newChecked);
        } else {
            //** Unchecked All */
            typeof setIsAllChecked === "function" && setIsAllChecked(false);
            typeof setItemList === "function" && setItemList([]);
            typeof onRowSelection === "function" && onRowSelection([]);
        }
    };
    const handleSortingRows = (key: string) => {
        if (sortDescriptor.column !== "" && key !== sortDescriptor.column) {
            setRows({
                items: rowsData,
                sortDescriptor: { column: key, direction: "ascending" },
            });
            return setSortDescriptor({ column: key, direction: "ascending" });
        }
        if (sortDescriptor.direction === "descending") {
            setRows({
                items: rowsData,
                sortDescriptor: { column: key, direction: "ascending" },
            });
            return setSortDescriptor({ column: key, direction: "ascending" });
        }
        setRows({
            items: rowsData,
            sortDescriptor: { column: key, direction: "descending" },
        });
        return setSortDescriptor({ column: key, direction: "descending" });
    };
    //** Render */
    const renderSelectionMode = () => {
        if (isSelectionMode) {
            return (
                <div className="flex items-center px-3 py-2 font-semibold text-tiny">
                    <Checkbox
                        defaultSelected={isAllChecked}
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
                className={twMerge(
                    "headCell flex-1 flex items-center min-w-36 px-3 py-2 font-semibold text-capitalize text-tiny",
                    sortingMode &&
                        "flex [&>button]:opacity-0 [&>button]:hover:opacity-100 [&>button]:transition-all [&>button]:duration-500 cursor-pointer",
                    column.className,
                )}
                onClick={() => sortingMode && handleSortingRows(column.key)}
            >
                {column.name}
                {sortingMode && (
                    <Button
                        className="w-auto h-auto bg-transparent p-0"
                        isIconOnly
                        onClick={() => handleSortingRows(column.key)}
                    >
                        <ChevronDownIcon
                            className={twMerge(
                                "w-2.5 h-2.5 text-gray-500 transition-all",
                                sortDescriptor.direction === "ascending" && "transform rotate-180",
                            )}
                        />
                    </Button>
                )}
            </div>
        );
    };
    return (
        <div className="sticky top-0 z-10">
            <div className="min-w-full w-fit flex items-center bg-gray-100 rounded-md">
                {!pinnedColumns?.left?.includes("__Selection__") && renderSelectionMode()}
                {pinnedColumns?.left && pinnedColumns?.left?.length > 0 && (
                    <div className="cellStickyLeft">
                        {pinnedColumnsLeft.map((column: any) => renderColumn(column))}
                    </div>
                )}
                {dataColumn.map((column: any) => renderColumn(column))}
                {pinnedColumns?.right && pinnedColumns?.right?.length > 0 && (
                    <div className="cellStickyRight">
                        {pinnedColumnsRight.map((column: any) => renderColumn(column))}
                    </div>
                )}
            </div>
        </div>
    );
}

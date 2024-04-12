"use client";

import React, { useContext, useMemo, useState } from "react";
import clsx from "clsx";
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
        handleRows,
        handleCheckedItem,
        handleCheckedAll,
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

    const dataColumn = useMemo(() => {
        return columns?.filter((column: any) => !pinnedColumns?.left?.includes(column.key));
    }, [columns, pinnedColumns]);

    //** Functions */
    const handleOnChange = (checkedAll: boolean) => {
        if (checkedAll) {
            //** Checked All */
            const newChecked = items.map((row: any) => row.id);

            typeof handleCheckedAll === "function" && handleCheckedAll(true);
            typeof handleCheckedItem === "function" && handleCheckedItem(newChecked);
            typeof onRowSelection === "function" && onRowSelection(newChecked);
        } else {
            //** Unchecked All */
            typeof handleCheckedAll === "function" && handleCheckedAll(false);
            typeof handleCheckedItem === "function" && handleCheckedItem([]);
            typeof onRowSelection === "function" && onRowSelection([]);
        }
    };

    const handleSortingRows = (key: string) => {
        if (sortDescriptor.column !== "" && key !== sortDescriptor.column) {
            handleRows({
                items: rowsData,
                sortDescriptor: { column: key, direction: "ascending" },
            });
            return setSortDescriptor({ column: key, direction: "ascending" });
        }

        if (sortDescriptor.direction === "descending") {
            handleRows({
                items: rowsData,
                sortDescriptor: { column: key, direction: "ascending" },
            });
            return setSortDescriptor({ column: key, direction: "ascending" });
        }

        handleRows({
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
                    sortingMode &&
                        "[&>button]:opacity-0 [&>button]:hover:opacity-100 [&>button]:transition-all [&>button]:duration-500 cursor-pointer",
                    column.className,
                )}
                onClick={() => sortingMode && handleSortingRows(column.key)}
            >
                {column.name}

                {sortingMode && (
                    <Button.Icon className="w-auto h-auto p-0">
                        <ChevronDownIcon
                            className={clsx(
                                "w-3 text-gray-500 transition-all",
                                sortDescriptor.direction === "ascending" && "transform rotate-180",
                            )}
                        />
                    </Button.Icon>
                )}
            </div>
        );
    };

    return (
        <div className="sticky top-0 z-10">
            <div className="min-w-full w-fit flex items-center bg-gray-100 rounded-md">
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

"use client";

import React from "react";
import clsx from "clsx";
import Checkbox from "../Checkbox";
import { useTableStore } from "@/stores/useTableStore";

export default function TableBody({
    rows,
    columns,
    isCheckedList,
    emptyRows,
    checked = [],
}: {
    rows: any;
    columns: any;
    isCheckedList?: boolean;
    emptyRows: number;
    checked?: readonly number[];
}) {
    //** Store */
    const { checkedStore, allCheckedStore } = useTableStore();

    //** Variables */
    const isChecked = (id: number) => checked?.indexOf(id) !== -1;

    //** Functions */
    const handleChecked = (id: number) => {
        const idChecked = checked?.indexOf(id);
        let newChecked: readonly number[] = [];

        if (idChecked === -1) {
            //** idChecked not contain in newChecked */
            newChecked = newChecked.concat(checked, id);
        } else if (idChecked === 0) {
            //** unchecked last idChecked has contain in newChecked */
            newChecked = newChecked.concat(checked.slice(1));
        } else if (idChecked === checked.length - 1) {
            //** unchecked last idChecked has contain in newChecked when full length */
            newChecked = newChecked.concat(checked.slice(0, -1));
        } else if (idChecked > 0) {
            //** unchecked idChecked any where has contain in newChecked */
            newChecked = newChecked.concat(
                checked.slice(0, idChecked),
                checked.slice(idChecked + 1),
            );
        }

        checkedStore(newChecked);
        allCheckedStore(newChecked.length === rows.length);
    };

    return (
        <div>
            {rows?.map((row: any) => {
                return (
                    <div
                        key={row.id}
                        className={clsx(
                            "flex items-center rounded-md",
                            "even:bg-gray-50 hover:bg-gray-50",
                        )}
                    >
                        {isCheckedList && (
                            <div className="flex items-center px-3 py-2">
                                <Checkbox
                                    checked={isChecked(row.id)}
                                    onChange={() => handleChecked(row.id)}
                                />
                            </div>
                        )}
                        {columns?.map((column: any) => {
                            return (
                                <div
                                    key={column.key}
                                    className={clsx("flex-1 px-3 py-2 text-sm", column.className)}
                                >
                                    {typeof column.content === "function" && column.content(row)}
                                </div>
                            );
                        })}
                    </div>
                );
            })}

            {emptyRows > 0 && <div style={{ height: 61 * emptyRows }}></div>}
        </div>
    );
}

"use client";

import React from "react";
import Cells from "../Table2/Cells";
import Checkbox from "../Checkbox";
import { useTableStore } from "@/stores/useTableStore";

export default function TableBody({
    rows,
    columns,
    isCheckedList,
    checked = [],
}: {
    rows: any;
    columns: any;
    isCheckedList?: boolean;
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
        <tbody>
            {rows?.map((row: any) => {
                return (
                    <tr key={row.id} className="hover:bg-gray-50">
                        {isCheckedList && (
                            <td className="px-3 py-2">
                                <Checkbox
                                    checked={isChecked(row.id)}
                                    onChange={() => handleChecked(row.id)}
                                />
                            </td>
                        )}
                        {columns?.map((column: any) => {
                            return (
                                <td
                                    key={column.id}
                                    className="px-3 py-2 text-sm rounded-md"
                                >
                                    <Cells row={row} columnKey={column.id} />
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}

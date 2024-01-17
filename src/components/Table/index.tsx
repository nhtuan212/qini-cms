"use client";

import React, { useEffect } from "react";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import { useTableStore } from "@/stores/useTableStore";

export default function Table({
    columns,
    rows,
    isCheckedList,
}: {
    columns: any;
    rows: any;
    isCheckedList?: boolean;
}) {
    //** Store */
    const { checked, allCheckedStore, checkedStore } = useTableStore();

    //** Functions */
    // isCheckedList
    const handleAllChecked = (checked: boolean) => {
        if (checked) {
            const newChecked = rows.map((n: any) => n.id);
            allCheckedStore(true);
            return checkedStore(newChecked);
        }
        allCheckedStore(false);
        checkedStore([]);
    };

    //** Effects */
    useEffect(() => {
        // Clear all checked when unmount
        return () => {
            allCheckedStore(false);
            checkedStore([]);
        };
    }, [allCheckedStore, checkedStore]);

    return (
        <div className="rounded-md p-3 border shadow-lg">
            <table className="table-auto border-collapse">
                <TableHead
                    columns={columns}
                    rowsLength={rows.length}
                    isCheckedList={isCheckedList}
                    onCheckedAll={handleAllChecked}
                />
                <TableBody
                    columns={columns}
                    rows={rows}
                    checked={checked}
                    isCheckedList={isCheckedList}
                />
            </table>
        </div>
    );
}

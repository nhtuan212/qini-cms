"use client";

import React from "react";
import Checkbox from "../Checkbox";
import { useTableStore } from "@/stores/useTableStore";

export default function TableHead({
    columns,
    isCheckedList,
    onCheckedAll,
}: {
    columns: any;
    isCheckedList?: boolean;
    rowsLength?: number;
    onCheckedAll?: (checked: boolean) => void;
}) {
    //** Store */
    const { isAllChecked } = useTableStore();

    return (
        <thead className="sticky top-0 z-20">
            <tr className="bg-gray-100">
                {isCheckedList && (
                    <th className="px-3 py-2 flex items-center">
                        <Checkbox
                            checked={isAllChecked}
                            onChange={onCheckedAll}
                        />
                    </th>
                )}
                {columns?.map((column: any) => (
                    <th
                        key={column.id}
                        className="w-1/2 px-3 py-2 font-semibold text-tiny first:rounded-l-md last:rounded-r-md"
                        align="left"
                    >
                        {column.name}
                    </th>
                ))}
            </tr>
            <tr className="w-px h-px block my-0.5"></tr>
        </thead>
    );
}

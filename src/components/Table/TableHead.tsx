"use client";

import React from "react";
import Checkbox from "../Checkbox";
import { useTableStore } from "@/stores/useTableStore";
import clsx from "clsx";

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
        <div className="sticky top-0 z-20">
            <div className="flex items-center w-full bg-gray-100 rounded-md">
                {isCheckedList && (
                    <div className="flex items-center px-3 py-2 font-semibold text-tiny">
                        <Checkbox checked={isAllChecked} onChange={onCheckedAll} />
                    </div>
                )}
                {columns?.map((column: any) => (
                    <div
                        key={column.key}
                        className={clsx(
                            "flex-1 px-3 py-2 font-semibold text-tiny",
                            column.className,
                        )}
                    >
                        {column.name.toUpperCase()}
                    </div>
                ))}
            </div>
            <div className="w-px h-px block my-0.5"></div>
        </div>
    );
}

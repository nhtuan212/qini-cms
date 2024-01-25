"use client";

import React from "react";
import { useTableStore } from "@/stores/useTableStore";
import { usePaginationStore } from "@/stores/usePaginationStore";

export default function RowsPerPage({
    pageSize,
    rowsPerPage,
}: {
    pageSize?: number;
    rowsPerPage?: number[];
}) {
    //** Store */
    const { getPageSize, setPageSize } = useTableStore();
    const { storeCurrentPage } = usePaginationStore();

    //** Functions */
    const handleChangePageSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.currentTarget.value));
        storeCurrentPage(1);
    };

    return (
        <div className="flex justify-end items-center mb-5">
            <label className="flex items-center text-default-400 text-small">
                <span className="mr-2">Rows per page:</span>
                <select
                    className="bg-blue-500 p-2 text-white rounded-md cursor-pointer"
                    onChange={handleChangePageSize}
                    defaultValue={pageSize || getPageSize}
                >
                    {rowsPerPage?.map(number => (
                        <option key={number} value={number}>
                            {number}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

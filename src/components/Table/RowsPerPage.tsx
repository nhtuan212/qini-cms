"use client";

import React from "react";
import { useTableStore } from "@/stores/useTableStore";
import { usePaginationStore } from "@/stores/usePaginationStore";

export default function RowsPerPage({
    rowsPerPage,
}: {
    rowsPerPage?: number[];
}) {
    //** Store */
    const { pageSize, pageSizeStore } = useTableStore();
    const { currentPageStore } = usePaginationStore();

    //** Functions */
    const handleChangePageSize = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        pageSizeStore(Number(event.currentTarget.value));
        currentPageStore(1);
    };

    return (
        <div className="flex justify-end items-center mb-4">
            <label className="flex items-center text-default-400 text-small">
                <span className="mr-2">Rows per page:</span>
                {rowsPerPage && rowsPerPage.length > 0 ? (
                    <select
                        className="bg-blue-500 p-2 text-white rounded-md cursor-pointer"
                        onChange={handleChangePageSize}
                    >
                        {rowsPerPage?.map(number => (
                            <option key={number} value={number}>
                                {number}
                            </option>
                        ))}
                    </select>
                ) : (
                    pageSize
                )}
            </label>
        </div>
    );
}

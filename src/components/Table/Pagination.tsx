"use client";

import React, { useContext, useEffect } from "react";
import Button from "../Button";
import { TableContext } from "./TableProvider";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type PaginationProps = {
    rows: any[];

    pageSize: number;
    pageSizeOptions: number[];
};

export default function Pagination(props: PaginationProps) {
    //** Destructuring */
    const { rows, pageSize, pageSizeOptions } = props;

    //** Context */
    const { currentPage, rowsPerPage, handleCurrentPage, handleRowsPerPage } =
        useContext(TableContext);

    //** Variables */
    const totalPage = rows.length;
    const initialPage = 1;

    //** Effects */
    useEffect(() => {
        handleRowsPerPage(pageSize);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!totalPage || totalPage <= 1) return null;

    return (
        <div className="w-full h-full flex justify-end mt-4">
            <div className="flex items-center gap-4 mr-4 text-sm">
                <p>Rows per page: </p>
                <select
                    className="bg-gray-200 py-2 px-1 border rounded-md"
                    defaultValue={rowsPerPage}
                    onChange={e => {
                        handleRowsPerPage(+e.target.value);
                        handleCurrentPage(1);
                    }}
                >
                    {pageSizeOptions.map(item => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
                <p>{`${currentPage} - ${currentPage + rowsPerPage - 1} of ${totalPage}`}</p>
            </div>
            <nav className="pagination">
                <Button.Icon
                    className="min-w-8 bg-gray-200 p-0.5"
                    onClick={() => handleCurrentPage(currentPage - rowsPerPage)}
                    disabled={currentPage === initialPage}
                >
                    <ChevronLeftIcon className="w-4 text-gray-800" />
                </Button.Icon>

                <Button.Icon
                    className="min-w-8 bg-gray-200 p-0.5"
                    onClick={() => handleCurrentPage(currentPage + rowsPerPage)}
                    disabled={currentPage + rowsPerPage > totalPage}
                >
                    <ChevronRightIcon className="w-4 text-gray-800" />
                </Button.Icon>
            </nav>
        </div>
    );
}

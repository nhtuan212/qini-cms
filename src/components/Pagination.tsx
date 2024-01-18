"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Button from "./Button";
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

interface PaginationProps {
    className?: string;
    initialPage?: number;
    total: number;
}

export default function Pagination({
    className,
    initialPage = 1,
    total,
}: PaginationProps) {
    //** States */
    const [currentPage, setCurrentPage] = useState<number>(initialPage);

    //** Variables */
    const firstPage = initialPage;
    const lastPage = total;

    const paginationNumbers = [];
    // const range = 5;
    // const limit =
    //     currentPage < range
    //         ? range
    //         : currentPage + 2 > total
    //           ? total
    //           : currentPage + 2;

    // const prev =
    //     currentPage < range
    //         ? 1
    //         : currentPage + 2 > total
    //           ? total - range + 1
    //           : currentPage - 2;

    for (let i: number = firstPage; i <= total; i++) {
        if (i < 1) continue;
        if (i > total) break;
        paginationNumbers.push(i);
    }

    //** Functions */
    const handleChangePage = (value: number) => {
        setCurrentPage(value);
    };

    const handlePageLoadLess = () => {
        setCurrentPage(firstPage);
    };

    const handlePageLoadMore = () => {
        setCurrentPage(lastPage);
    };

    const handleFirstPage = () => {
        setCurrentPage(firstPage);
    };

    const handleLastPage = () => {
        setCurrentPage(lastPage);
    };

    if (!total || total <= 1) return null;

    return (
        <div className={clsx("flex w-full h-full", className)}>
            <nav className="pagination">
                <Button className="bg-gray-200" onClick={handleFirstPage}>
                    <ChevronDoubleLeftIcon className="w-4" />
                </Button>

                <Button
                    className="items-end bg-transparent p-0"
                    onClick={handlePageLoadLess}
                >
                    <EllipsisHorizontalIcon className="w-4" />
                </Button>

                {paginationNumbers.map(pageItem => (
                    <Button
                        key={pageItem}
                        className={clsx(
                            "pagination-item",
                            currentPage === pageItem && "pagination-active",
                        )}
                        onClick={() => handleChangePage(pageItem)}
                    >
                        {pageItem}
                    </Button>
                ))}

                <Button
                    className="items-end bg-transparent p-0"
                    onClick={handlePageLoadMore}
                >
                    <EllipsisHorizontalIcon className="w-4" />
                </Button>

                <Button className="bg-gray-200" onClick={handleLastPage}>
                    <ChevronDoubleRightIcon className="w-4" />
                </Button>
            </nav>
        </div>
    );
}

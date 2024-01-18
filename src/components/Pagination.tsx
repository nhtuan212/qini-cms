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
    totalPage: number;
}

export default function Pagination({ className, totalPage }: PaginationProps) {
    //** Variables */
    const paginationNumbers = [];
    const initialPage = 1;

    //** States */
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [rangePage, setRangePage] = useState<number[]>([initialPage, 5]);

    for (let i: number = rangePage[0]; i <= rangePage[1]; i++) {
        if (i < 1) continue;
        if (i > totalPage) break;
        paginationNumbers.push(i);
    }

    //** Functions */
    const handleChangePage = (value: number) => {
        setCurrentPage(value);
    };

    const handlePageLoadLess = () => {
        setRangePage([rangePage[1] - 5 - 4, rangePage[1] - 5]);
        setCurrentPage(rangePage[1] - 5);
    };

    const handlePageLoadMore = () => {
        setRangePage([rangePage[1] + 1, rangePage[1] + 5]);
        setCurrentPage(rangePage[1] + 1);
    };

    const handleFirstPage = () => {
        setCurrentPage(initialPage);
        setRangePage([initialPage, initialPage + 4]);
    };

    const handleLastPage = () => {
        setRangePage([totalPage, totalPage + 4]);
        setCurrentPage(totalPage);
    };

    if (!totalPage || totalPage <= 1) return null;

    return (
        <div className={clsx("flex w-full h-full", className)}>
            <nav className="pagination">
                <Button className="bg-gray-200" onClick={handleFirstPage}>
                    <ChevronDoubleLeftIcon className="w-4" />
                </Button>

                {rangePage[0] > initialPage && (
                    <Button
                        className="items-end bg-transparent p-0"
                        onClick={handlePageLoadLess}
                    >
                        <EllipsisHorizontalIcon className="w-4" />
                    </Button>
                )}

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

                {rangePage[1] < totalPage && (
                    <Button
                        className="items-end bg-transparent p-0"
                        onClick={handlePageLoadMore}
                    >
                        <EllipsisHorizontalIcon className="w-4" />
                    </Button>
                )}

                <Button className="bg-gray-200" onClick={handleLastPage}>
                    <ChevronDoubleRightIcon className="w-4" />
                </Button>
            </nav>
        </div>
    );
}

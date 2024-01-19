"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Button from "./Button";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
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
    const [disablePrev, setDisablePrev] = useState<boolean>(false);
    const [disableNext, setDisableNext] = useState<boolean>(false);
    const [pageStatus, setPageStatus] = useState<string>("");

    for (let i: number = rangePage[0]; i <= rangePage[1]; i++) {
        if (i < 1) continue;
        if (i > totalPage) break;
        paginationNumbers.push(i);
    }

    //** Effects */
    useEffect(() => {
        // Set range page when page status is changed //
        if (pageStatus === "increase") {
            setRangePage([rangePage[1] + 1, rangePage[1] + 5]);
            setCurrentPage(rangePage[1] + 1);
        }
        if (pageStatus === "decrease") {
            setRangePage([rangePage[1] - 5 - 4, rangePage[1] - 5]);
            setCurrentPage(rangePage[1] - 5);
        }
        setPageStatus("");
    }, [pageStatus, rangePage]);

    useEffect(() => {
        // Set current page to first page when total page is changed //
        if (currentPage > rangePage[1]) {
            setRangePage([currentPage, currentPage + 4]);
        }
        if (currentPage < rangePage[0] && currentPage > initialPage) {
            setRangePage([currentPage - 4, currentPage]);
        }

        // Disable prev button when current page is 1 //
        if (currentPage === initialPage) return setDisablePrev(true);

        // Disable next button when current page is last page //
        if (currentPage >= totalPage) return setDisableNext(true);

        setDisablePrev(false);
        setDisableNext(false);
    }, [currentPage, disablePrev, disableNext, rangePage, totalPage]);

    if (!totalPage || totalPage <= 1) return null;

    return (
        <div className={clsx("flex w-full h-full", className)}>
            <nav className="pagination">
                <Button
                    className="bg-gray-200"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={disablePrev}
                >
                    <ChevronLeftIcon className="w-4" />
                </Button>

                {rangePage[0] > initialPage && (
                    <Button
                        className="items-end bg-transparent p-0"
                        onClick={() => setPageStatus("decrease")}
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
                        onClick={() => setCurrentPage(pageItem)}
                    >
                        {pageItem}
                    </Button>
                ))}

                {rangePage[1] < totalPage && (
                    <Button
                        className="items-end bg-transparent p-0"
                        onClick={() => setPageStatus("increase")}
                    >
                        <EllipsisHorizontalIcon className="w-4" />
                    </Button>
                )}

                <Button
                    className="bg-gray-200"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={disableNext}
                >
                    <ChevronRightIcon className="w-4" />
                </Button>
            </nav>
        </div>
    );
}

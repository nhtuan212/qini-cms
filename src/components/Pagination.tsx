"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Button from "./Button";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { usePaginationStore } from "@/stores/usePaginationStore";

interface PaginationProps {
    className?: string;
    totalPage: number;
}

export default function Pagination({ className, totalPage }: PaginationProps) {
    //** Store */
    const { currentPage, rangePage, currentPageStore, rangePageStore } =
        usePaginationStore();

    //** Variables */
    const paginationNumbers = [];
    const initialPage = 1;

    //** States */
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
            rangePageStore([rangePage[1] + 1, rangePage[1] + 5]);
            currentPageStore(rangePage[1] + 1);
        }
        if (pageStatus === "decrease") {
            rangePageStore([rangePage[1] - 5 - 4, rangePage[1] - 5]);
            currentPageStore(rangePage[1] - 5);
        }
        setPageStatus("");
    }, [pageStatus, rangePage, currentPageStore, rangePageStore]);

    useEffect(() => {
        // Set current page to first page when total page is changed //
        if (currentPage > rangePage[1]) {
            return rangePageStore([currentPage, currentPage + 4]);
        }
        if (currentPage < rangePage[0] && currentPage > initialPage) {
            return rangePageStore([currentPage - 4, currentPage]);
        }

        currentPage === 1 && rangePageStore([initialPage, 5]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    useEffect(() => {
        // Disable prev button when current page is 1 //
        if (currentPage === initialPage) {
            setDisablePrev(true);
            return setDisableNext(false);
        }

        // Disable next button when current page is last page //
        if (currentPage >= totalPage) {
            setDisableNext(true);
            return setDisablePrev(false);
        }

        setDisableNext(false);
        setDisableNext(false);
    }, [currentPage, disablePrev, disableNext, totalPage]);

    if (!totalPage || totalPage <= 1) return null;

    return (
        <div className={clsx("flex w-full h-full", className)}>
            <nav className="pagination">
                <Button
                    className="bg-gray-200"
                    onClick={() => currentPageStore(currentPage - 1)}
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
                        onClick={() => currentPageStore(pageItem)}
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
                    onClick={() => currentPageStore(currentPage + 1)}
                    disabled={disableNext}
                >
                    <ChevronRightIcon className="w-4" />
                </Button>
            </nav>
        </div>
    );
}

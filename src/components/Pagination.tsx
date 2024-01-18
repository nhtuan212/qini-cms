"use client";

import React, { useState } from "react";
import clsx from "clsx";
import Button from "./Button";

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
    const [active, setActive] = useState<number>(initialPage);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);

    //** Variables */
    const paginationNumbers = [];
    const range = 5;
    const limit =
        currentPage < range
            ? range
            : currentPage + 2 > total
              ? total
              : currentPage + 2;

    const prev =
        currentPage < range
            ? 1
            : currentPage + 2 > total
              ? total - range + 1
              : currentPage - 2;

    for (let i: number = prev; i <= limit; i++) {
        if (i < 1) continue;
        if (i > total) break;
        paginationNumbers.push(i);
    }

    //** Functions */
    const handleChangePage = (value: number) => {
        setActive(value);
        setCurrentPage(value);
    };

    return (
        <div className={clsx("flex w-full h-full", className)}>
            <nav className="pagination">
                {paginationNumbers.map(pageItem => (
                    <Button
                        key={pageItem}
                        className={clsx(
                            "pagination-item",
                            active === pageItem && "pagination-active",
                        )}
                        onClick={() => handleChangePage(pageItem)}
                    >
                        {pageItem}
                    </Button>
                ))}
            </nav>
        </div>
    );
}

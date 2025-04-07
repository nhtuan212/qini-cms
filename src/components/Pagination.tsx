"use client";

import { Pagination as PaginationNextUI, PaginationProps } from "@heroui/react";

export default function Pagination({ ...props }: PaginationProps) {
    return <PaginationNextUI size={props.size || "sm"} {...props} />;
}

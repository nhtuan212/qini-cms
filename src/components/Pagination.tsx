"use client";

import { Pagination as PaginationNextUI, PaginationProps } from "@nextui-org/react";

export default function Pagination({ ...props }: PaginationProps) {
    return <PaginationNextUI size={props.size || "sm"} {...props} />;
}

"use client";

import React from "react";
import { TEXT } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";

export default function StaffDetailColumns() {
    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (params: any) => formatDate(params.row.targetAt),
        },
        {
            key: "timeSheet",
            name: TEXT.WORKING_HOURS,
            content: (params: any) => <div>{`${params.row.checkIn} - ${params.row.checkOut}`}</div>,
        },
        {
            key: "timeNumber",
            name: TEXT.TIME_NUMBER,
            content: (params: any) => params.row.workingHours,
        },
        {
            key: "target",
            name: TEXT.TARGET,
            content: (params: any) => formatCurrency(params.row.target),
        },
    ];

    return columns;
}

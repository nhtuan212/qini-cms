"use client";

import React from "react";
import { TEXT } from "@/constants/text";
import { currencyFormat, formatDate } from "@/utils";

export default function StaffDetailColumns() {
    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (params: any) => (
                <div>{`${formatDate(params.row.createAt)} - ${params.row.report.shift.name}`}</div>
            ),
        },
        {
            key: "timeSheet",
            name: TEXT.TIME_SHEET,
            content: (params: any) => <div>{`${params.row.checkIn} - ${params.row.checkOut}`}</div>,
        },
        {
            key: "timeNumber",
            name: TEXT.TIME_NUMBER,
            content: (params: any) => <div>{params.row.timeWorked}</div>,
        },
        {
            key: "target",
            name: TEXT.TARGET,
            content: (params: any) => <div>{currencyFormat(params.row.target)}</div>,
        },
    ];

    return columns;
}

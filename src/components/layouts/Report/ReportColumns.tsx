"use client";

import React from "react";
import { TEXT } from "@/constants/text";
import { currencyFormat } from "@/utils";

export default function ReportColumns() {
    const columns = [
        {
            key: "name",
            name: TEXT.NAME,
            content: (row: any) => <div>{row.staffName}</div>,
        },
        {
            key: "timeSheet",
            name: TEXT.TIME_SHEET,
            className: "max-w-[8rem] text-center",
            content: (row: any) => (
                <div className="flex">
                    <p className="flex-1">{row.checkIn}</p>
                    <span className="flex-0">-</span>
                    <p className="flex-1">{row.checkOut}</p>
                </div>
            ),
        },
        {
            key: "timeWorked",
            name: TEXT.TIME_NUMBER,
            className: "text-center",
            content: (row: any) => <div>{row.timeWorked}</div>,
        },
        {
            key: "target",
            className: "max-w-[8rem]",
            name: TEXT.TARGET,
            content: (row: any) => <div>{currencyFormat(row.target)}</div>,
        },
    ];

    return columns;
}

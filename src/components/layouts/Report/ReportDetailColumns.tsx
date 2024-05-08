"use client";

import React from "react";
import { TEXT } from "@/constants/text";
import { currencyFormat } from "@/utils";

export default function ReportColumns() {
    const columns = [
        {
            key: "name",
            name: TEXT.NAME,
            content: (params: any) => <div>{params.row.staff.name}</div>,
        },
        {
            key: "timeSheet",
            name: TEXT.TIME_SHEET,
            className: "max-w-[8rem] text-center",
            content: (params: any) => (
                <div className="flex">
                    <p className="flex-1">{params.row.checkIn}</p>
                    <span className="flex-0">-</span>
                    <p className="flex-1">{params.row.checkOut}</p>
                </div>
            ),
        },
        {
            key: "timeWorked",
            name: TEXT.TIME_NUMBER,
            className: "text-center",
            content: (params: any) => <div>{params.row.timeWorked}</div>,
        },
        {
            key: "target",
            className: "max-w-[8rem]",
            name: TEXT.TARGET,
            content: (params: any) => <div>{currencyFormat(params.row.target)}</div>,
        },
    ];

    return columns;
}

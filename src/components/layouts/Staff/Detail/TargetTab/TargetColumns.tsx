"use client";

import React from "react";
import { TEXT } from "@/constants/text";
import { currencyFormat, dateFormat } from "@/utils";

export default function TargetColumns() {
    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (row: any) => <div>{dateFormat(row.createAt)}</div>,
        },
        {
            key: "timeNumber",
            name: TEXT.TIME_NUMBER,
            content: (row: any) => <div>{row.timeWorked}</div>,
        },
        {
            key: "target",
            name: TEXT.TARGET,
            content: (row: any) => <div>{currencyFormat(row.target)}</div>,
        },
    ];

    return columns;
}

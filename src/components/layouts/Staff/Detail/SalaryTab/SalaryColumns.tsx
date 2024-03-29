"use client";

import React from "react";
import { TEXT } from "@/constants/text";
import { currencyFormat, dateFormat } from "@/utils";

export default function SalaryColumns() {
    const columns = [
        {
            key: "createAt",
            name: TEXT.MONTH,
            content: (params: any) => <div>{dateFormat(params.row.createAt)}</div>,
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

"use client";

import React from "react";
import { TEXT } from "@/constants/text";
import { currencyFormat, dateFormat } from "@/utils";

export default function TargetDetailColumns() {
    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (row: any) => <div>{dateFormat(row.createAt)}</div>,
        },
        {
            key: "target",
            name: TEXT.TARGET,
            content: (row: any) => <div>{currencyFormat(row.target)}</div>,
        },
    ];

    return columns;
}

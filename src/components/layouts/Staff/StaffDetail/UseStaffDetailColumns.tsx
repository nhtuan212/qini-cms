"use client";

import React from "react";
import { TEXT } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";
import { TimeSheetProps } from "@/stores/useTimeSheetStore";

export default function useStaffDetailColumns() {
    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (params: TimeSheetProps) => formatDate(params.row.date),
        },
        {
            key: "shiftName",
            name: TEXT.WORK_SHIFT,
            className: "min-w-20",
            content: (params: TimeSheetProps) => params.row.shiftName,
        },
        {
            key: "timeSheet",
            name: TEXT.WORKING_HOURS,
            className: "min-w-30",
            content: (params: TimeSheetProps) => {
                return (
                    <div className="w-full flex justify-between">
                        <div>{params.row.checkIn}</div>
                        <div>-</div>
                        <div>{params.row.checkOut}</div>
                    </div>
                );
            },
        },
        {
            key: "timeNumber",
            name: TEXT.TIME_NUMBER,
            className: "min-w-20",
            content: (params: TimeSheetProps) => params.row.workingHours,
        },
        {
            key: "target",
            name: TEXT.TARGET,
            content: (params: TimeSheetProps) => formatCurrency(params.row.target),
        },
    ];

    return columns;
}

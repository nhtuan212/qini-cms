"use client";

import React from "react";
import { TEXT } from "@/constants/text";
import { currencyFormat } from "@/utils";
import { useStaffStore } from "@/stores/useStaffStore";
import { StaffProps } from "@/types/staffProps";

export default function ReportColumns() {
    //** Stores */
    const { staff } = useStaffStore();

    const columns = [
        {
            key: "name",
            name: TEXT.NAME,
            content: (row: any) => (
                <div>
                    {(staff.find((item: StaffProps) => item.id === row.staffId) as any)?.name}
                </div>
            ),
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

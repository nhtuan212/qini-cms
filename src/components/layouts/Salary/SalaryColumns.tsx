"use client";

import React from "react";
import { TEXT } from "@/constants/text";
import { currencyFormat } from "@/utils";
import Image from "next/image";

export default function SalaryColumns() {
    const columns = [
        {
            key: "staff",
            name: TEXT.STAFF,
            content: (row: any) => <div>{row.staffName}</div>,
        },
        {
            key: "totalTime",
            name: TEXT.TIME_NUMBER,
            className: "flex flex-none justify-center w-16",
            content: (row: any) => <div>{row.totalTime}</div>,
        },
        {
            key: "totalTarget",
            name: TEXT.REVENUE,
            content: (row: any) => <div>{currencyFormat(row.totalTarget)}</div>,
        },
        {
            key: "performance",
            name: TEXT.PERFORMANCE,
            content: (row: any) => <div>{currencyFormat(row.performance)}</div>,
        },
        {
            key: "rank",
            name: TEXT.RANK,
            className: "flex flex-none justify-center w-24",
            content: (row: any) => {
                switch (row.rank) {
                    case "A":
                        return (
                            <div>
                                <Image src="/assets/1st.svg" width={40} height={40} alt="1st" />
                            </div>
                        );
                    case "B":
                        return (
                            <div>
                                <Image src="/assets/2nd.svg" width={30} height={30} alt="2nd" />
                            </div>
                        );
                    default:
                        return (
                            <div>
                                <Image
                                    src="/assets/normalRank.svg"
                                    width={20}
                                    height={20}
                                    alt="2nd"
                                />
                            </div>
                        );
                }
            },
        },
        {
            key: "rate",
            name: TEXT.RATE,
            className: "flex flex-none justify-center w-20",
            content: (row: any) => <div>{row.rate}</div>,
        },
        {
            key: "total",
            name: TEXT.SALARY_RECEIVED,
            content: (row: any) => <div>{currencyFormat(row.total)}</div>,
        },
    ];

    return columns;
}

"use client";

import React from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { currencyFormat } from "@/utils";
import { MODAL } from "@/constants";
import { TEXT } from "@/constants/text";

export default function SalaryColumns() {
    //** Stores */
    const { getStaffById } = useStaffStore();
    const { openModal } = useModalStore();

    const columns = [
        {
            key: "staff",
            name: TEXT.STAFF,
            content: (params: any) => <div>{params.row.staffName}</div>,
        },
        {
            key: "totalTime",
            name: TEXT.TIME_NUMBER,
            className: "flex flex-none justify-center w-16",
            content: (params: any) => <div>{params.row.totalTime}</div>,
        },
        {
            key: "totalTarget",
            name: TEXT.REVENUE,
            content: (params: any) => <div>{currencyFormat(params.row.totalTarget as number)}</div>,
        },
        {
            key: "performance",
            name: TEXT.PERFORMANCE,
            content: (params: any) => <div>{currencyFormat(params.row.performance as number)}</div>,
        },
        {
            key: "rank",
            name: TEXT.RANK,
            className: "flex flex-none justify-center w-24",
            content: (params: any) => {
                switch (params.row.rank) {
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
            content: (params: any) => <div>{params.row.rate}</div>,
        },
        {
            key: "",
            name: "",
            className: "flex flex-none justify-center w-20",
            content: (params: any) => (
                <Button.Icon
                    onClick={() => {
                        openModal(MODAL.SALARY_DETAIL);
                        getStaffById(params.row.staffId as string);
                    }}
                >
                    <EyeIcon className="w-5" />
                </Button.Icon>
            ),
        },
        // {
        //     key: "total",
        //     name: TEXT.SALARY_RECEIVED,
        //     content: (params: any) => <div>{currencyFormat(params.row.total)}</div>,
        // },
    ];

    return columns;
}

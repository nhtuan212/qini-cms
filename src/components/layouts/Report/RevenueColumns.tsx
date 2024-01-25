"use client";

import React from "react";
import Button from "@/components/Button";
import { useReportStore } from "@/stores/useReportStore";
import { useRevenueStore } from "@/stores/useRevenueStore";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@nextui-org/react";
import { TEXT } from "@/constants/text";
import { currencyFormat, dateFormat } from "@/utils";

export default function RevenueColumns() {
    //** Stores */
    const { openReportModal } = useReportStore();
    const { getRevenue, deleteRevenue } = useRevenueStore();

    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (row: any) => <div>{dateFormat(row.createAt)}</div>,
        },
        {
            key: "revenue",
            name: TEXT.REVENUE,
            content: (row: any) => <div>{currencyFormat(row.revenue)}</div>,
        },
        {
            key: "actions",
            name: "ACTIONS",
            className: "w-[8rem] text-end",
            content: (row: any) => (
                <div className="relative flex justify-end items-center gap-2">
                    <Tooltip content="Details">
                        <Button
                            className="min-w-0 bg-transparent p-0 text-default-500"
                            onClick={() => {
                                openReportModal(true, row.id);
                            }}
                        >
                            <EyeIcon className="w-5" />
                        </Button>
                    </Tooltip>
                    {/* <Tooltip content="Edit">
                        <Button className="min-w-0 bg-transparent p-0 text-default-500">
                            <PencilSquareIcon className="w-5" />
                        </Button>
                    </Tooltip> */}
                    <Tooltip content="Remove">
                        <Button
                            className="min-w-0 bg-transparent p-0 text-default-500"
                            onClick={async () => deleteRevenue(row.id).then(() => getRevenue())}
                        >
                            <TrashIcon className="w-5" />
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return columns;
}

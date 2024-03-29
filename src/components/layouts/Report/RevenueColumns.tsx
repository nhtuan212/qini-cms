"use client";

import React from "react";
import Button from "@/components/Button";
import { useReportStore } from "@/stores/useReportStore";
import { useRevenueStore } from "@/stores/useRevenueStore";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@nextui-org/react";
import { TEXT } from "@/constants/text";
import { currencyFormat, dateFormat } from "@/utils";
import { useModalStore } from "@/stores/useModalStore";
import { MODAL } from "@/constants";

export default function RevenueColumns() {
    //** Stores */
    const { getReportByRevenue } = useReportStore();
    const { getRevenue, deleteRevenue } = useRevenueStore();
    const { openModal } = useModalStore();

    const columns = [
        {
            key: "createAt",
            name: TEXT.DATE,
            content: (params: any) => dateFormat(params.row.createAt),
        },
        {
            key: "revenue",
            name: TEXT.REVENUE,
            content: (params: any) => currencyFormat(params.row.revenue),
        },
        {
            key: "actions",
            name: "ACTIONS",
            className: "w-[8rem] text-end",
            content: (params: any) => (
                <div className="relative flex justify-end items-center gap-2">
                    <Tooltip content="Details">
                        <Button
                            className="min-w-0 bg-transparent p-0 text-default-500"
                            onClick={() => {
                                openModal(MODAL.REPORT_DETAIL);
                                getReportByRevenue(params.row.id);
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
                            onClick={async () =>
                                deleteRevenue(params.row.id).then(() => getRevenue())
                            }
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

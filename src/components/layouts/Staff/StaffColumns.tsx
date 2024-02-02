"use client";

import React from "react";
import Button from "@/components/Button";
import { useStaffStore } from "@/stores/useStaffStore";
import { useModalStore } from "@/stores/useModalStore";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@nextui-org/react";
import { TEXT } from "@/constants/text";
import { dateFormat } from "@/utils";
import { MODAL } from "@/constants";

export default function RevenueColumns() {
    //** Stores */
    const { getStaff, getStaffById, deleteStaff } = useStaffStore();
    const { openModal } = useModalStore();

    //** Functions */
    const handleEditStaff = (id: string) => {
        getStaffById(id);
        openModal(MODAL.ADD_STAFF, "edit");
    };

    const columns = [
        {
            key: "createAt",
            name: TEXT.ADD_DATE,
            content: (row: any) => <div>{dateFormat(row.createAt)}</div>,
        },
        {
            key: "name",
            name: TEXT.NAME,
            content: (row: any) => <div>{row.name}</div>,
        },
        {
            key: "actions",
            name: "ACTIONS",
            className: "w-[8rem] text-end",
            content: (row: any) => (
                <div className="relative flex justify-end items-center gap-2">
                    <Tooltip content="Edit">
                        <Button
                            className="min-w-0 bg-transparent p-0 text-default-500"
                            onClick={() => handleEditStaff(row.id)}
                        >
                            <PencilSquareIcon className="w-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Remove">
                        <Button
                            className="min-w-0 bg-transparent p-0 text-default-500"
                            onClick={async () => deleteStaff(row.id).then(() => getStaff())}
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

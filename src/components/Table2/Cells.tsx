"use client";

import React from "react";
import { Chip, Tooltip, User } from "@nextui-org/react";
import {
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

export default function Cells({ row, columnKey }: any) {
    const cellValue = row[columnKey];

    const statusColorMap: any = {
        active: "success",
        paused: "danger",
        vacation: "warning",
    };

    switch (columnKey) {
        case "name":
            return (
                <User
                    avatarProps={{ radius: "lg", src: row.avatar }}
                    description={row.email}
                    name={cellValue}
                >
                    {row.email}
                </User>
            );
        case "role":
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                    <p className="text-bold text-sm capitalize text-default-400">
                        {row.team}
                    </p>
                </div>
            );
        case "status":
            return (
                <Chip
                    className="capitalize"
                    color={statusColorMap[row.status]}
                    size="sm"
                    variant="flat"
                >
                    {cellValue}
                </Chip>
            );
        case "actions":
            return (
                <div className="relative flex items-center gap-2">
                    <Tooltip content="Details">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <EyeIcon className="w-6" />
                        </span>
                    </Tooltip>
                    <Tooltip content="Edit user">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <PencilSquareIcon className="w-6" />
                        </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            <TrashIcon className="w-6" />
                        </span>
                    </Tooltip>
                </div>
            );
        default:
            return cellValue;
    }
}

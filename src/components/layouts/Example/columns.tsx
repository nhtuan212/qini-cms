"use client";

import React from "react";
import ImageComponent from "@/components/Image";
import Button from "@/components/Button";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Chip, Tooltip } from "@nextui-org/react";

export default function Columns() {
    const statusColorMap: any = {
        active: "success",
        paused: "danger",
        vacation: "warning",
    };

    const columns = [
        {
            key: "name",
            name: "NAME",
            content: (params: any) => (
                <div className="flex items-center gap-2">
                    <span className="w-10 h-10">
                        <ImageComponent
                            className="rounded-lg"
                            src={params.row.avatar}
                            alt={params.row.name}
                        />
                    </span>
                    <div>
                        <p className="text-sm">{params.row.name}</p>
                        <p className="text-sm text-default-400">{params.row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            name: "ROLE",
            content: (params: any) => (
                <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">{params.row.role}</p>
                    <p className="text-bold text-sm capitalize text-default-400">
                        {params.row.team}
                    </p>
                </div>
            ),
        },
        {
            key: "status",
            name: "STATUS",
            content: (params: any) => (
                <Chip
                    className="capitalize"
                    color={statusColorMap[params.row.status]}
                    size="sm"
                    variant="flat"
                >
                    {params.row.status}
                </Chip>
            ),
        },
        {
            key: "actions",
            name: "ACTIONS",
            content: () => (
                <div className="relative flex items-center gap-2">
                    <Tooltip content="Details">
                        <Button className="min-w-0 bg-transparent p-0 text-default-500">
                            <EyeIcon className="w-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Edit">
                        <Button className="min-w-0 bg-transparent p-0 text-default-500">
                            <PencilSquareIcon className="w-5" />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Remove">
                        <Button className="min-w-0 bg-transparent p-0 text-default-500">
                            <TrashIcon className="w-5" />
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return columns;
}

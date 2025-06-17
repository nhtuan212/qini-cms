// "use client";

import React from "react";
import Button from "@/components/Button";
import { Tooltip } from "@heroui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TimeSheetProps } from "@/stores/useTimeSheetStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { ROLE, TEXT } from "@/constants";
import { formatDate } from "@/utils";

export function useTimeSheetHistoryColumns() {
    //** Stores */
    const { profile } = useProfileStore();

    //** Render */
    return [
        {
            key: TEXT.DATE,
            name: TEXT.DATE,
            className: "min-w-24",
            content: (params: TimeSheetProps) => formatDate(params.row.date),
        },
        {
            key: TEXT.WORK_SHIFT,
            name: TEXT.WORK_SHIFT,
            className: "min-w-20 justify-center text-center",
            content: (params: TimeSheetProps) => params.row.shiftName,
        },
        {
            key: TEXT.CHECK_IN,
            name: TEXT.CHECK_IN,
            className: "min-w-20 justify-center text-center",
            content: (params: TimeSheetProps) => params.row.checkIn,
        },
        {
            key: TEXT.CHECK_OUT,
            name: TEXT.CHECK_OUT,
            className: "min-w-20 justify-center text-center",
            content: (params: TimeSheetProps) => params.row.checkOut,
        },
        {
            key: TEXT.WORKING_HOURS,
            name: TEXT.WORKING_HOURS,
            className: "min-w-24 justify-center text-center",
            content: (params: TimeSheetProps) => params.row.workingHours,
        },
        {
            key: "actions",
            name: "",
            className: "min-w-fit",
            content: () => (
                <div className="flex justify-end gap-1">
                    <Tooltip content={TEXT.EDIT}>
                        <Button
                            className="min-w-0 bg-transparent p-0 text-default-500"
                            onPress={() => console.log("edit")}
                        >
                            <PencilIcon className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                    {profile.role === ROLE.ADMIN && (
                        <Tooltip content={TEXT.DELETE}>
                            <Button
                                className="min-w-0 bg-transparent p-0 text-default-500"
                                onPress={() => console.log("delete")}
                            >
                                <TrashIcon className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];
}

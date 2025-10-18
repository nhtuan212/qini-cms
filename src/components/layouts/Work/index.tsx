"use client";

import React from "react";
import WorkType from "./WorkType";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { CalendarDateRangeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { TEXT } from "@/constants";

export default function Work() {
    //** Store */
    const { getDrawer } = useDrawerStore();

    //** Render */
    return (
        <Card className="space-y-4">
            <h2 className="title flex items-center gap-x-2">
                <CalendarDateRangeIcon className="w-6 h-6" />
                {TEXT.MANAGE_WORK}
            </h2>
            <p className="text-sm text-gray-500">{TEXT.SCHEDULE_WORK}</p>

            <Button
                startContent={<PencilIcon className="w-4 h-4" />}
                onClick={() =>
                    getDrawer({
                        isOpen: true,
                        drawerHeader: (
                            <h2 className="title flex items-center gap-x-2">
                                <CalendarDateRangeIcon className="w-6 h-6" />
                                {TEXT.MANAGE_WORK}
                            </h2>
                        ),
                        drawerBody: <WorkType />,
                    })
                }
            >
                {TEXT.MANAGE_WORK}
            </Button>
        </Card>
    );
}

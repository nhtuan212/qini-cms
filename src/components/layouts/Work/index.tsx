"use client";

import React, { useState } from "react";
import WorkType from "./WorkType";
import WorkAssignment from "./WorkAssignment";
import WeekDates from "../../WeekDates";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { CalendarDateRangeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useDrawerStore } from "@/stores/useDrawerStore";
import { TEXT } from "@/constants";
import { getCurrentVietnamDate, parseVietnamDate } from "@/utils";

export default function Work() {
    //** Store */
    const { getDrawer } = useDrawerStore();

    //** States */
    const [currentWeek, setCurrentWeek] = useState(() => {
        // Initialize with current date in Ho Chi Minh timezone
        return getCurrentVietnamDate();
    });

    //** Functions */
    const handleCurrentWeekChange = ({ startDate }: { startDate: string; endDate: string }) => {
        // Parse the start date and convert to Ho Chi Minh timezone
        const newWeekDate = parseVietnamDate(startDate, "DD/MM/YYYY");

        setCurrentWeek(newWeekDate);
    };

    //** Render */
    return (
        <div className="space-y-4">
            <Card className="space-y-6">
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

                <WeekDates onCurrentWeekChange={handleCurrentWeekChange} />
            </Card>

            <WorkAssignment currentWeek={currentWeek} />
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import TimeSheetRecord from "./TimeSheetRecord";
import TimeSheetHistory from "./TimeSheetHistory";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore } from "@/stores/useShiftsStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useTargetStore } from "@/stores/useTargetStore";
import { TEXT } from "@/constants";
import { formatDate } from "@/utils";

export default function AttendanceNavigation() {
    //** States */
    const [activeTab, setActiveTab] = useState("record");

    //** Stores */
    const { staffById } = useStaffStore();
    const { getShifts } = useShiftStore();
    const { getTimeSheet, cleanUpTimeSheet } = useTimeSheetStore();
    const { getTarget } = useTargetStore();

    //** Variables */
    const tabs = [
        {
            label: TEXT.TIME_SHEET,
            icon: ClockIcon,
            value: "record",
            component: <TimeSheetRecord />,
        },
        {
            label: TEXT.HISTORY,
            icon: CalendarIcon,
            value: "history",
            component: <TimeSheetHistory />,
        },
    ];

    //** Effects */
    useEffect(() => {
        getTimeSheet({ staffId: staffById.id });

        return () => {
            cleanUpTimeSheet();
        };
    }, [cleanUpTimeSheet, getTimeSheet, staffById.id]);

    useEffect(() => {
        getShifts();

        // Get target to check when user check in
        getTarget(`?date=${formatDate(new Date(), "YYYY-MM-DD")}&staff_id=${staffById.id}`);
    }, [getShifts, getTarget, staffById.id]);

    //** Render */
    return (
        <div className="flex flex-col gap-y-6">
            <Card>
                <div className="flex">
                    {tabs.map(tab => (
                        <Button
                            key={tab.value}
                            className={"h-auto flex-col flex-1 py-4 px-6 gap-1 font-medium"}
                            variant={activeTab === tab.value ? "flat" : "light"}
                            size="lg"
                            onPress={() => setActiveTab(tab.value)}
                        >
                            <tab.icon className="h-6 w-6" />
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </Card>

            <Card className="p-4">{tabs.find(tab => tab.value === activeTab)?.component}</Card>
        </div>
    );
}

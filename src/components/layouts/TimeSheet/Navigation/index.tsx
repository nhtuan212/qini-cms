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
import { TEXT } from "@/constants";
import { formatDate } from "@/utils";

export default function AttendanceNavigation() {
    //** States */
    const [activeTab, setActiveTab] = useState("record");

    //** Stores */
    const { staffById } = useStaffStore();
    const { getShifts } = useShiftStore();
    const { getTimeSheet, cleanUpTimeSheet } = useTimeSheetStore();

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
        getTimeSheet({ staffId: staffById.id, date: formatDate(new Date(), "YYYY-MM-DD") });

        return () => {
            cleanUpTimeSheet();
        };
    }, [cleanUpTimeSheet, getTimeSheet, staffById.id]);

    useEffect(() => {
        getShifts();
    }, [getShifts]);

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

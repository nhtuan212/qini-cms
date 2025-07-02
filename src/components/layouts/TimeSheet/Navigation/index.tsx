"use client";

import React, { useEffect, useState } from "react";
import StaffDetail from "../../Staff/StaffDetail";
import RecordTimeSheet from "./RecordTimeSheet";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useShiftStore } from "@/stores/useShiftsStore";
import { useTargetStore } from "@/stores/useTargetStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { formatDate, snakeCaseQueryString } from "@/utils";
import { TEXT } from "@/constants";

export default function AttendanceNavigation() {
    //** States */
    const [activeTab, setActiveTab] = useState("record");

    //** Stores */
    const { getShifts } = useShiftStore();
    const { getTarget } = useTargetStore();
    const { cleanUpTimeSheet } = useTimeSheetStore();

    //** Variables */
    const tabs = [
        {
            label: TEXT.TIME_SHEET,
            icon: ClockIcon,
            value: "record",
            component: <RecordTimeSheet />,
        },
        {
            label: TEXT.TARGET,
            icon: CurrencyDollarIcon,
            value: "detail",
            component: <StaffDetail />,
        },
    ];

    //** Effects */
    useEffect(() => {
        return () => {
            cleanUpTimeSheet();
        };
    }, [cleanUpTimeSheet]);

    useEffect(() => {
        getShifts();
        getTarget(snakeCaseQueryString({ target_at: formatDate(new Date(), "YYYY-MM-DD") }));
    }, [getShifts, getTarget]);

    //** Render */
    return (
        <div className="flex flex-col gap-y-6">
            <Card className="sm:p-4 p-2">
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

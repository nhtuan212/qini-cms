"use client";

import React, { useEffect, useState } from "react";
import StaffDetail from "../../Staff/StaffDetail";
import RecordTimeSheet from "./RecordTimeSheet";
import Salary from "../../Salary";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { ClockIcon, CurrencyDollarIcon, GiftIcon } from "@heroicons/react/24/outline";
import { useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore } from "@/stores/useShiftsStore";
import { useTargetStore } from "@/stores/useTargetStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { formatDate, snakeCaseQueryString } from "@/utils";
import { TEXT } from "@/constants";

export default function AttendanceNavigation() {
    //** States */
    const [activeTab, setActiveTab] = useState("record");

    //** Stores */
    const { staffById } = useStaffStore();
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
            icon: GiftIcon,
            value: "detail",
            component: <StaffDetail />,
        },
        {
            label: TEXT.SALARY,
            icon: CurrencyDollarIcon,
            value: "salary",
            component: <Salary staffById={staffById} />,
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
        <div className="flex flex-col sm:gap-y-4 gap-y-2">
            <Card className="sm:p-4 p-2">
                <div className="flex">
                    {tabs.map(tab => (
                        <Button
                            key={tab.value}
                            className={
                                "h-auto flex-col flex-1 sm:py-4 py-2 sm:px-6 px-2 gap-1 font-medium"
                            }
                            variant={activeTab === tab.value ? "flat" : "light"}
                            size="lg"
                            onPress={() => setActiveTab(tab.value)}
                        >
                            <tab.icon className="sm:h-6 sm:w-6 h-4 w-4" />
                            <p className="sm:text-base text-sm">{tab.label}</p>
                        </Button>
                    ))}
                </div>
            </Card>

            <Card className="sm:p-4 p-2">
                {tabs.find(tab => tab.value === activeTab)?.component}
            </Card>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CheckIn from "./CheckIn";
import { Bars3Icon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants";

export default function AttendanceNavigation() {
    //** States */
    const [activeTab, setActiveTab] = useState("checkIn");

    //** Variables */
    const tabs = [
        {
            label: TEXT.ATTENDANCE,
            icon: ClockIcon,
            value: "checkIn",
            component: <CheckIn />,
        },
        {
            label: TEXT.HISTORY,
            icon: CalendarIcon,
            value: "history",
        },
        {
            label: TEXT.STATISTICS,
            icon: Bars3Icon,
            value: "statistics",
        },
    ];

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

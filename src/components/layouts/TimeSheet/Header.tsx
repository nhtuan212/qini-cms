"use client";

import React, { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants";
import { formatTime } from "@/utils";

export default function AttendanceHeader() {
    //** States */
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    //** Functions */
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    //** Effects */
    useEffect(() => {
        // Set initial time on client mount
        setCurrentTime(new Date());

        // Start the timer
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    //** Render */
    return (
        <div className="bg-white rounded-lg shadow-lg sm:p-6 p-2 mb-6">
            <div className="flex items-center sm;justify-between justify-center flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary p-1 rounded-full">
                        <ClockIcon className="sm:w-10 sm:h-10 w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="sm:text-2xl text-xl font-bold text-gray-800">
                            {TEXT.TIME_SHEET_SYSTEM}
                        </h1>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-mono font-bold text-primary">
                        {currentTime ? formatTime(currentTime.toISOString(), true) : "--:--:--"}
                    </div>
                    <div className="text-gray-600">
                        {currentTime ? formatDate(currentTime) : "Loading..."}
                    </div>
                </div>
            </div>
        </div>
    );
}

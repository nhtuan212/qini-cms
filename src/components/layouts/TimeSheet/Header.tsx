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
        <div className="bg-white rounded-lg shadow-lg sm:p-6 p-2 sm:mb-4 mb-2">
            <div className="flex items-center sm:justify-between justify-center flex-wrap sm:gap-4 gap-2">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary rounded-full">
                        <ClockIcon className="sm:w-10 sm:h-10 w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="sm:text-2xl text-base font-bold text-gray-800">
                            {TEXT.TIME_SHEET_SYSTEM}
                        </h1>
                    </div>
                </div>
                <div className="sm:text-right text-center">
                    <div className="sm:text-3xl text-lg font-mono font-bold text-primary">
                        {currentTime ? formatTime(currentTime.toISOString(), true) : "--:--:--"}
                    </div>
                    <div className="sm:text-base text-sm text-gray-600">
                        {currentTime ? formatDate(currentTime) : "Loading..."}
                    </div>
                </div>
            </div>
        </div>
    );
}

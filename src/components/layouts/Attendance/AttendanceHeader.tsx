"use client";

import React, { useEffect, useState } from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants";

export default function AttendanceHeader() {
    //** States */
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    //** Functions */
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between gap-x-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-primary p-1 rounded-full">
                        <ClockIcon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {TEXT.ATTENDANCE_SYSTEM}
                        </h1>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-mono font-bold text-primary">
                        {currentTime ? formatTime(currentTime) : "--:--:--"}
                    </div>
                    <div className="text-gray-600">
                        {currentTime ? formatDate(currentTime) : "Loading..."}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import AttendanceHeader from "./AttendanceHeader";
import Navigation from "./Navigation";

export default function Attendance() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="min-h-fit p-4 bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg">
                <div className="max-w-xl mx-auto">
                    <AttendanceHeader />
                    <Navigation />
                </div>
            </div>
        </div>
    );
}

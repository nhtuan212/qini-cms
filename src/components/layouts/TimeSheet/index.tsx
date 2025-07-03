"use client";

import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";

export default function Attendance() {
    return (
        <div className="max-h-[80vh] sm:p-4 p-3 bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg overflow-y-auto">
            <Header />
            <Navigation />
        </div>
    );
}

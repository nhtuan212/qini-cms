"use client";

import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";

export default function Attendance() {
    return (
        <div className="min-h-fit p-4 bg-gradient-to-br from-primary-300 to-primary-500 rounded-lg">
            <Header />
            <Navigation />
        </div>
    );
}

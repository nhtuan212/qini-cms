"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

export default function Loading({ className }: { className?: string }) {
    return (
        <div
            className={twMerge(
                "absolute top-0 left-0 w-full h-full flex items-center justify-center",
                "bg-white bg-opacity-90 z-50",
                className,
            )}
        >
            <div className="w-16 h-16 border-t-2 border-b-2 border-gray-400 rounded-full animate-spin"></div>
        </div>
    );
}

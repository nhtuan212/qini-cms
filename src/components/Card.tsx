import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className }: CardProps) {
    return (
        <div className={twMerge("bg-white rounded-lg shadow-lg p-6", className)}>{children}</div>
    );
}

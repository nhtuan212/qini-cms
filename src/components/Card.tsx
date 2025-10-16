import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className }: CardProps) {
    // Default responsive padding
    const defaultPadding = "md:p-6 sm:p-4 p-2";

    // Check if className contains any padding classes
    const isPaddingProperty =
        className &&
        /\bp-\d+|\bpx-\d+|\bpy-\d+|\bpt-\d+|\bpr-\d+|\bpb-\d+|\bpl-\d+|\bp-\[|\bpx-\[|\bpy-\[|\bpt-\[|\bpr-\[|\bpb-\[|\bpl-\[/.test(
            className,
        );

    // Use default padding only if no padding class is provided
    const paddingCustom = isPaddingProperty ? "" : defaultPadding;

    return (
        <div className={twMerge("bg-white rounded-lg shadow-lg", paddingCustom, className)}>
            {children}
        </div>
    );
}

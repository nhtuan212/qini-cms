import clsx from "clsx";
import React from "react";

export default function Loading({ className }: { className?: string }) {
    return (
        <div
            className={clsx(
                "fixed top-0 left-0 z-[99999]",
                "w-screen h-screen",
                "flex justify-center items-center",
                "bg-white",
            )}
        >
            <div
                className={clsx(
                    "w-10 h-10 border-3 border-t-primary animate-spin rounded-full",
                    className,
                )}
            ></div>
        </div>
    );
}

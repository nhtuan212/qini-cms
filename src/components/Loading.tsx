import clsx from "clsx";
import React from "react";

export default function Loading({ className }: { className?: string }) {
    return (
        <div
            className={clsx(
                "fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-[9999]",
                className,
            )}
        >
            <div
                className={clsx("w-10 h-10 border-3 border-t-primary animate-spin rounded-full")}
            ></div>
        </div>
    );
}

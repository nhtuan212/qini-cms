"use client";

import React, { SyntheticEvent, useEffect } from "react";
import clsx from "clsx";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export type AlertProps = {
    isOpen: boolean;
    title?: string;
    duration?: number;
    onClose?: () => void;
    type: "success" | "error" | "info";
    children: React.ReactNode;
};

export default function Alert({
    isOpen,
    title,
    duration = 2000,
    onClose,
    type,
    children,
}: AlertProps) {
    //** Variables */
    let alertBackground: string;
    let alertIcon: React.ReactNode;

    switch (type) {
        case "success":
            alertBackground = "bg-green-600";
            alertIcon = <CheckCircleIcon className="w-5" />;
            break;
        case "error":
            alertBackground = "bg-red-500";
            alertIcon = <ExclamationCircleIcon className="w-5" />;
            break;
        case "info":
            alertBackground = "bg-blue-500";
            alertIcon = <InformationCircleIcon className="w-5" />;
            break;
        default:
            alertBackground = "bg-primary";
            alertIcon = <InformationCircleIcon className="w-5" />;
            break;
    }

    //** Functions */
    const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        typeof onClose === "function" && onClose();
    };

    //** Hooks */
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, duration]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed top-2 right-2 left-auto z-[1000] animate-fadeIn">
            <div className={clsx("flex gap-3 px-4 py-2 text-white rounded", alertBackground)}>
                <div className="h-full mt-0.5">{alertIcon}</div>

                <div>
                    {title && <p className="mb-1 font-semibold">{title}</p>}
                    <p className="mt-0.5 text-sm">{children}</p>
                </div>

                {/* Close button */}
                <button className="ml-4" onClick={handleClose}>
                    <XMarkIcon className="w-5" />
                </button>
            </div>
        </div>
    );
}

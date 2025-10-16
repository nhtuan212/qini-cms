"use client";

import React from "react";
import { DateRangePicker as DateRangePickerNextUI, DateRangePickerProps } from "@heroui/react";

export default function DateRangePicker({ size = "sm", ...props }: DateRangePickerProps) {
    return (
        <DateRangePickerNextUI
            aria-label="dateRange"
            label={props.label || "Date Range picker"}
            size={size}
            variant={props.variant || "bordered"}
            {...props}
        />
    );
}

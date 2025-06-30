"use client";

import React from "react";
import { DateRangePicker as DateRangePickerNextUI, DateRangePickerProps } from "@heroui/react";

export default function DateRangePicker({ ...props }: DateRangePickerProps) {
    return (
        <DateRangePickerNextUI
            aria-label="dateRange"
            label={props.label || "Date Range picker"}
            variant={props.variant || "bordered"}
            {...props}
        />
    );
}

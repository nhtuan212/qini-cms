"use client";

import React from "react";
import { DateRangePicker as DateRangePickerNextUI, DateRangePickerProps } from "@nextui-org/react";

export default function DateRangePicker({ ...props }: DateRangePickerProps) {
    return <DateRangePickerNextUI label={props.label || "Date Range picker"} {...props} />;
}

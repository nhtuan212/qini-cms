"use client";

import React from "react";
import { DatePicker as DatePickerNextUI, DatePickerProps } from "@heroui/react";

type DatePickerType = {
    errorMessage?: string;
} & DatePickerProps;

const DatePicker = React.forwardRef<HTMLElement, DatePickerType>(({ ...props }, ref) => {
    return <DatePickerNextUI ref={ref} variant={props.variant || "bordered"} {...props} />;
});

export default DatePicker;

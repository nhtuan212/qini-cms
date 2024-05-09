"use client";

import React from "react";
import { DatePicker as DatePickerNextUI, DatePickerProps } from "@nextui-org/date-picker";

type DatePickerType = {
    errorMessage?: string;
} & DatePickerProps;

export default function DatePicker(props: DatePickerType) {
    return <DatePickerNextUI {...props} />;
}

"use client";

import clsx from "clsx";
import React from "react";
import Datepicker, { DatepickerType } from "react-tailwindcss-datepicker";

type DatePickerProps = {
    errorMessage?: string;
} & DatepickerType;

export default function DatePickerComponent(props: DatePickerProps) {
    return <Datepicker containerClassName={clsx("datepicker", props.classNames)} {...props} />;
}

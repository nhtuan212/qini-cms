"use client";

import React from "react";
import { DatePicker as DatePickerNextUI, DatePickerProps } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";

type DatePickerType = {
    errorMessage?: string;
} & DatePickerProps;

export default function DatePicker(props: DatePickerType) {
    // Does not apply because does not still support format date time by dd/mm/YYYY
    return (
        <I18nProvider locale="vi-VN">
            <DatePickerNextUI {...props} />
        </I18nProvider>
    );
}

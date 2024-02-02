"use client";

import React, { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useReportStore } from "@/stores/useReportStore";
import { ReportParams, ReportProps } from "@/types/reportProps";
import { currencyFormat, sumArray } from "@/utils";
import { TEXT } from "@/constants/text";
import { useStaffStore } from "@/stores/useStaffStore";

export default function TargetDetailTopContent() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { reportByStaff, filterReportByStaff } = useReportStore();

    //** States */
    const [value, setValue] = useState<DateValueType>({
        startDate: null,
        endDate: null,
    });

    //** Functions */
    const handleValueChange = (newValue: DateValueType) => {
        filterReportByStaff({
            id: staffById?.id,
            params: newValue as ReportParams,
        });

        setValue(newValue);
    };

    const dateCompare = (date: string) => {
        if (value?.startDate && value?.endDate) {
            return date >= value.startDate && date <= value.endDate;
        }
        return true;
    };

    //** Variables */
    const filterDate = reportByStaff.filter(item => {
        const date = new Date(item.createAt).toISOString().split("T")[0];
        return dateCompare(date);
    });
    const currentTarget = filterDate.map((item: ReportProps) => item.target);
    const sum = sumArray(currentTarget);

    return (
        <div className="flex flex-col gap-4 mb-5">
            <div className="flex justify-between items-center gap-3">
                <div className="w-full">
                    {`${TEXT.TARGET}: `}
                    <b className="text-primary">{currencyFormat(sum)}</b>
                </div>
                <Datepicker
                    containerClassName="datepicker"
                    value={value}
                    onChange={handleValueChange}
                    useRange={false}
                    displayFormat={"DD/MM/YYYY"}
                    readOnly
                />
            </div>
        </div>
    );
}

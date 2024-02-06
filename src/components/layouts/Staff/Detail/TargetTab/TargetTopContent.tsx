"use client";

import React, { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useReportStore } from "@/stores/useReportStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { TEXT } from "@/constants/text";
import { currencyFormat, getCurrentMonth, sumArray } from "@/utils";

export default function TargetTopContent() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { reportByStaff, filterReportByStaff } = useReportStore();

    //** States */
    const [dateValue, setDateValue] = useState<DateValueType>(getCurrentMonth());

    //** Variables */
    const totalTarget = sumArray(reportByStaff, "target");

    //** Functions */
    const handleValueChange = (newValue: DateValueType) => {
        filterReportByStaff({
            id: staffById?.id,
            params: newValue,
        });
        setDateValue(newValue);
    };

    return (
        <div className="flex flex-col gap-4 mb-5">
            <div className="flex justify-between items-center gap-3">
                <div className="w-full">
                    {`${TEXT.TOTAL_TARGET}: `}
                    <b className="text-primary">{currencyFormat(totalTarget)}</b>
                </div>
                <Datepicker
                    containerClassName="datepicker"
                    value={dateValue}
                    onChange={handleValueChange}
                    useRange={false}
                    displayFormat={"DD/MM/YYYY"}
                    readOnly
                />
            </div>
        </div>
    );
}

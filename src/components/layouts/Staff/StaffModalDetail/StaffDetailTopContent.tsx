"use client";

import React, { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useStaffStore } from "@/stores/useStaffStore";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";
import { TEXT } from "@/constants/text";
import { currencyFormat, getCurrentMonth, sumArray } from "@/utils";

export default function TargetTopContent() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { getReportsOnStaff, reportsOnStaff, isReportsOnStaffLoading } =
        useReportsOnStaffsStore();

    //** States */
    const [dateValue, setDateValue] = useState<DateValueType>(getCurrentMonth());

    //** Variables */
    const totalTarget = !isReportsOnStaffLoading ? sumArray(reportsOnStaff, "target") : 0;
    const totalTimeWorked = !isReportsOnStaffLoading ? sumArray(reportsOnStaff, "timeWorked") : 0;

    //** Functions */
    const handleValueChange = (newValue: DateValueType) => {
        setDateValue(newValue);

        getReportsOnStaff({
            staffId: staffById.id,
            ...newValue,
        });
    };

    return (
        <div className="flex flex-col gap-4 mb-5">
            <div className="flex justify-between items-center gap-3">
                <div className="w-full">
                    <div>
                        {`${TEXT.TOTAL_TARGET}: `}
                        <b className="text-primary">{currencyFormat(totalTarget)}</b>
                    </div>
                    <div>
                        {`${TEXT.TIME_SHEET}: `}
                        <b className="text-primary">{totalTimeWorked}</b>
                    </div>
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

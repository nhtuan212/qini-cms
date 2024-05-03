"use client";

import React, { useEffect, useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { TEXT } from "@/constants/text";
import { currencyFormat, getCurrentMonth, sumArray } from "@/utils";

export default function TargetTopContent() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { reportByStaff, getReportByStaff } = useReportsOnStaffsStore();

    //** States */
    const [dateValue, setDateValue] = useState<DateValueType>(getCurrentMonth());

    //** Variables */
    const totalTarget = sumArray(reportByStaff, "target");
    const totalTimeWorked = sumArray(reportByStaff, "timeWorked");

    //** Functions */
    const handleValueChange = (newValue: DateValueType) => {
        setDateValue(newValue);
    };

    //** Effects */
    useEffect(() => {
        getReportByStaff({
            staffId: staffById?.id,
            params: dateValue,
        });
    }, [staffById, getReportByStaff, dateValue]);

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

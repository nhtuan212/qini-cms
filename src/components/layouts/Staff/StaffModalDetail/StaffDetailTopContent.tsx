"use client";

import React, { useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import Button from "@/components/Button";
import { useStaffStore } from "@/stores/useStaffStore";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";
import { TEXT } from "@/constants/text";
import { currencyFormat, getDateTime, sumArray } from "@/utils";
import { RangeValue } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";

export default function TargetTopContent() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { getReportsOnStaff, reportsOnStaff, isReportsOnStaffLoading } =
        useReportsOnStaffsStore();

    //** States */
    const [dateValue, setDateValue] = useState<RangeValue<CalendarDate>>({
        start: getDateTime().firstDayOfMonth,
        end: getDateTime().lastDayOfMonth,
    });

    //** Variables */
    const totalTarget = !isReportsOnStaffLoading ? sumArray(reportsOnStaff, "target") : 0;
    const totalTimeWorked = !isReportsOnStaffLoading ? sumArray(reportsOnStaff, "timeWorked") : 0;

    //** Functions */
    const handleFilterReports = () => {
        getReportsOnStaff({
            staffId: staffById.id,
            startDate: dateValue.start.toString(),
            endDate: dateValue.end.toString(),
        });
    };

    //** Render */
    return (
        <div className="flex justify-between flex-wrap gap-3">
            <div>
                <div>
                    {`${TEXT.TOTAL_TARGET}: `}
                    <b className="text-primary">{currencyFormat(totalTarget)}</b>
                </div>
                <div>
                    {`${TEXT.TIME_SHEET}: `}
                    <b className="text-primary">{totalTimeWorked}</b>
                </div>
            </div>
            <div className="flex-1 flex flex-wrap gap-4 xs:justify-end items-center">
                <DateRangePicker
                    label={TEXT.DATE_PICKER}
                    className="w-fit"
                    value={dateValue}
                    onChange={(newValue: any) =>
                        setDateValue({
                            start: newValue?.start,
                            end: newValue?.end,
                        })
                    }
                    onKeyUp={e => {
                        if (e.key === "Enter") {
                            handleFilterReports();
                        }
                    }}
                />

                <Button onPress={() => handleFilterReports()}>{TEXT.SUBMIT}</Button>
            </div>
        </div>
    );
}

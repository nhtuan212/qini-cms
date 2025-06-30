"use client";

import React, { useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import Button from "@/components/Button";
import { RangeValue } from "@heroui/react";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { CalendarDate } from "@internationalized/date";
import { getDateTime } from "@/utils";
import { TEXT } from "@/constants";

export default function TargetTopContent() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { getTimeSheet } = useTimeSheetStore();

    //** States */
    const [dateValue, setDateValue] = useState<RangeValue<CalendarDate>>({
        start: getDateTime().firstDayOfMonth,
        end: getDateTime().lastDayOfMonth,
    });

    //** Functions */
    const handleFilterTargets = () => {
        getTimeSheet({
            staffId: staffById.id,
            startDate: dateValue.start.toString(),
            endDate: dateValue.end.toString(),
        });
    };

    //** Render */
    return (
        <div className="flex flex-col gap-4">
            <div className="flex-1 flex flex-wrap gap-4 items-center">
                <DateRangePicker
                    label={TEXT.DATE_PICKER}
                    className="flex-1 w-fit"
                    value={dateValue}
                    onChange={(newValue: any) =>
                        setDateValue({
                            start: newValue?.start,
                            end: newValue?.end,
                        })
                    }
                    onKeyUp={e => {
                        if (e.key === "Enter") {
                            handleFilterTargets();
                        }
                    }}
                />

                <Button onPress={() => handleFilterTargets()}>{TEXT.SUBMIT}</Button>
            </div>
        </div>
    );
}

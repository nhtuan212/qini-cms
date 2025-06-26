"use client";

import React, { useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { RangeValue } from "@heroui/react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { CalendarDate } from "@internationalized/date";

import { formatCurrency, getDateTime, roundToThousand } from "@/utils";
import { ROLE, TEXT } from "@/constants";

export default function TargetTopContent() {
    //** Stores */
    const { profile } = useProfileStore();
    const { staffById } = useStaffStore();
    const { getTimeSheet } = useTimeSheetStore();

    //** States */
    const [dateValue, setDateValue] = useState<RangeValue<CalendarDate>>({
        start: getDateTime().firstDayOfMonth,
        end: getDateTime().lastDayOfMonth,
    });
    const [salary, setSalary] = useState<number>(25000);
    const [bonus, setBonus] = useState<number>(0);

    //** Variables */
    const totalTarget = 0;
    const totalWorkingHours = 0;
    const totalSalary = totalWorkingHours * salary;

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

            {profile.role === ROLE.ADMIN && (
                <div className="flex justify-between gap-8">
                    <div className="flex-1 flex flex-col gap-2">
                        <Input
                            label={"Lương: "}
                            size="sm"
                            value={formatCurrency(salary) as string}
                            onValueChange={e => {
                                setSalary(Number(e.replace(/\D/g, "")));
                            }}
                        />
                        <Input
                            label={"Thưởng nóng: "}
                            size="sm"
                            value={formatCurrency(bonus) as string}
                            onValueChange={e => {
                                setBonus(Number(e.replace(/\D/g, "")));
                            }}
                        />
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-4">
                        <div className="flex-1 flex flex-col justify-end gap-2">
                            {totalTarget > 0 && (
                                <div className="flex justify-between">
                                    {`${TEXT.TOTAL_TARGET} (0.01%): `}
                                    <b className="text-primary">{formatCurrency(totalTarget)}</b>
                                </div>
                            )}
                            <div className="flex justify-between">
                                {`${TEXT.WORKING_HOURS}: `}
                                <b className="text-primary">{totalWorkingHours}</b>
                            </div>
                        </div>
                        <div>
                            {totalTarget > 0 && (
                                <>
                                    <div className="flex-1 flex justify-between">
                                        {`Tổng lương: `}
                                        <b className="text-primary">
                                            {formatCurrency(totalSalary)}
                                        </b>
                                    </div>

                                    <div className="flex-1 flex justify-between">
                                        {`Tiền thưởng doanh số: `}
                                        <b className="text-primary">
                                            {formatCurrency(
                                                roundToThousand(
                                                    Number((totalTarget * 0.01).toFixed(0)),
                                                ),
                                            )}
                                        </b>
                                    </div>
                                </>
                            )}
                            <div className="flex-1 flex justify-between">
                                {`Thực nhận:`}
                                <b className="text-primary">
                                    {formatCurrency(
                                        roundToThousand(
                                            Number(
                                                (totalSalary + totalTarget * 0.01 + bonus).toFixed(
                                                    0,
                                                ),
                                            ),
                                        ),
                                    )}
                                </b>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

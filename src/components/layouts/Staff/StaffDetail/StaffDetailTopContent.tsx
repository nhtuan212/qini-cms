"use client";

import React, { useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useStaffStore } from "@/stores/useStaffStore";
import { useReportsOnStaffsStore } from "@/stores/useReportsOnStaffsStore";
import { TEXT } from "@/constants/text";
import { currencyFormat, getDateTime, roundToThousand, sumArray } from "@/utils";
import { RangeValue } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";

export default function TargetTopContent() {
    //** Stores */
    const { staffById } = useStaffStore();
    const { isLoading, reportsOnStaff, getReportsOnStaff } = useReportsOnStaffsStore();

    //** States */
    const [dateValue, setDateValue] = useState<RangeValue<CalendarDate>>({
        start: getDateTime().firstDayOfMonth,
        end: getDateTime().lastDayOfMonth,
    });
    const [salary, setSalary] = useState<number>(25000);
    const [bonus, setBonus] = useState<number>(0);

    //** Variables */
    const totalTarget = !isLoading ? sumArray(reportsOnStaff, "target") : 0;
    const totalTimeWorked = !isLoading ? sumArray(reportsOnStaff, "timeWorked") : 0;
    const totalSalary = totalTimeWorked * salary;

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
        <>
            <div className="title">{staffById.name}</div>

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
                                handleFilterReports();
                            }
                        }}
                    />

                    <Button onPress={() => handleFilterReports()}>{TEXT.SUBMIT}</Button>
                </div>

                <div className="flex justify-between gap-8">
                    <div className="flex-1 flex flex-col gap-2">
                        <Input
                            label={"Lương: "}
                            size="sm"
                            value={currencyFormat(salary) as string}
                            onValueChange={e => {
                                setSalary(Number(e.replace(/\D/g, "")));
                            }}
                        />
                        <Input
                            label={"Thưởng nóng: "}
                            size="sm"
                            value={currencyFormat(bonus) as string}
                            onValueChange={e => {
                                setBonus(Number(e.replace(/\D/g, "")));
                            }}
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-4">
                        <div>
                            <div className="flex justify-between">
                                {`${TEXT.TOTAL_TARGET} (0.01%): `}
                                <b className="text-primary">{currencyFormat(totalTarget)}</b>
                            </div>
                            <div className="flex justify-between">
                                {`${TEXT.TIME_SHEET}: `}
                                <b className="text-primary">{totalTimeWorked}</b>
                            </div>
                        </div>
                        <div>
                            <div className="flex-1 flex justify-between">
                                {`Tổng lương: `}
                                <b className="text-primary">{currencyFormat(totalSalary)}</b>
                            </div>
                            <div className="flex-1 flex justify-between">
                                {`Tiền thưởng doanh số: `}
                                <b className="text-primary">
                                    {currencyFormat(
                                        roundToThousand(Number((totalTarget * 0.01).toFixed(0))),
                                    )}
                                </b>
                            </div>
                            <div className="flex-1 flex justify-between">
                                {`Thực nhận:`}
                                <b className="text-primary">
                                    {currencyFormat(
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
            </div>
        </>
    );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import SalaryForm from "./SalaryForm";
import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { camelCaseQueryString, formatCurrency, formatDate, getMonthRangeFromDate } from "@/utils";
import { ROLE, ROUTE, TEXT } from "@/constants";
import { SalaryPeriodProps } from "@/types";

export default function SalaryTopContent({
    totalAmount = 0,
    period,
}: {
    totalAmount?: number;
    period?: SalaryPeriodProps;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    //** Store */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** States */
    const [dateValue, setDateValue] = useState<RangeValue<CalendarDate> | null>(null);

    //** Variables */
    // Period being viewed: URL params take precedence, otherwise the default period BE resolved
    const periodStart = searchParams.get("startDate") || period?.startDate;
    const periodEnd = searchParams.get("endDate") || period?.endDate;

    const start = dayjs(periodStart);
    const end = dayjs(periodEnd);
    const isFullMonth =
        start.isValid() &&
        end.isValid() &&
        start.date() === 1 &&
        end.isSame(start, "month") &&
        end.date() === end.daysInMonth();

    const periodLabel = isFullMonth
        ? `${TEXT.MONTH} ${start.format("MM/YYYY")}`
        : `${formatDate(periodStart || null)} - ${formatDate(periodEnd || null)}`;

    //** Functions */
    const goToMonth = (offset: number) => {
        const { firstDayOfMonth, lastDayOfMonth } = getMonthRangeFromDate(
            start.add(offset, "month").format("YYYY-MM-DD"),
        );

        router.push(
            camelCaseQueryString({
                startDate: firstDayOfMonth,
                endDate: lastDayOfMonth,
            }),
        );
        setDateValue(null);
    };

    //** Render */
    return (
        <>
            <div className="flex justify-between items-center">
                <h3 className="title text-black">{TEXT.SALARY}</h3>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                    <DateRangePicker
                        className="w-sm"
                        value={dateValue}
                        onChange={newValue => {
                            setDateValue({
                                start: newValue?.start as CalendarDate,
                                end: newValue?.end as CalendarDate,
                            });
                        }}
                    />

                    {searchParams.get("startDate") && searchParams.get("endDate") && (
                        <Button
                            isIconOnly
                            variant="light"
                            color="default"
                            onPress={() => {
                                router.push(ROUTE.SALARY);
                                setDateValue(null);
                            }}
                            startContent={<XMarkIcon className="w-4 h-4" />}
                        />
                    )}

                    <Button
                        onPress={() => {
                            if (!dateValue) return;

                            router.push(
                                camelCaseQueryString({
                                    startDate: dateValue?.start.toString(),
                                    endDate: dateValue?.end.toString(),
                                }),
                            );
                        }}
                    >
                        {TEXT.SUBMIT}
                    </Button>
                </div>

                {profile.role === ROLE.ADMIN && (
                    <Button
                        startContent={<PlusIcon className="w-5 h-5" />}
                        onPress={() => {
                            getModal({
                                isOpen: true,
                                size: "5xl",
                                modalHeader: TEXT.CALCULATE_SALARY,
                                modalBody: <SalaryForm />,
                            });
                        }}
                    >
                        {TEXT.ADD_NEW}
                    </Button>
                )}
            </div>

            <div className="flex justify-between items-center">
                {periodStart && periodEnd && (
                    <div className="flex items-center gap-x-1">
                        <Button
                            isIconOnly
                            variant="light"
                            color="default"
                            onPress={() => goToMonth(-1)}
                            startContent={<ChevronLeftIcon className="w-4 h-4" />}
                        />
                        <span className="min-w-32 text-center font-semibold">{periodLabel}</span>
                        <Button
                            isIconOnly
                            variant="light"
                            color="default"
                            onPress={() => goToMonth(1)}
                            startContent={<ChevronRightIcon className="w-4 h-4" />}
                        />
                    </div>
                )}

                {totalAmount > 0 && (
                    <p className="text-gray-500">
                        {`${TEXT.TOTAL}: `}
                        <b className="text-lg text-primary">{formatCurrency(totalAmount)}</b>
                    </p>
                )}
            </div>
        </>
    );
}

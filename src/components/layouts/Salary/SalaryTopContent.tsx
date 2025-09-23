"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import SalaryForm from "./SalaryForm";
import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useProfileStore } from "@/stores/useProfileStore";
import { useModalStore } from "@/stores/useModalStore";
import { camelCaseQueryString } from "@/utils";
import { ROLE, ROUTE, TEXT } from "@/constants";

export default function SalaryTopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    //** Store */
    const { profile } = useProfileStore();
    const { getModal } = useModalStore();

    //** States */
    const [dateValue, setDateValue] = useState<RangeValue<CalendarDate> | null>(null);

    //** Render */
    return (
        <>
            <h3 className="title text-black">{TEXT.SALARY}</h3>

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
        </>
    );
}

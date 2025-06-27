import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useTargetStore } from "@/stores/useTargetStore";
import { formatDate, snakeCaseQueryString } from "@/utils";
import { ROUTE, TEXT } from "@/constants";
import { parseDate } from "@internationalized/date";

export default function TargetFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    //** Stores */
    const { createTarget } = useTargetStore();

    //** States */
    const [dateValue, setDateValue] = useState<RangeValue<CalendarDate> | null>(null);

    //** Functions */
    const handleFilterTargets = async () => {
        if (!dateValue) return null;

        router.push(
            snakeCaseQueryString({
                startDate: dateValue.start.toString(),
                endDate: dateValue.end.toString(),
            }),
        );
    };

    //** Effects */
    useEffect(() => {
        if (searchParams.get("start_date") && searchParams.get("end_date")) {
            return setDateValue({
                start: parseDate(formatDate(searchParams.get("start_date"), "YYYY-MM-DD")),
                end: parseDate(formatDate(searchParams.get("end_date"), "YYYY-MM-DD")),
            });
        }

        setDateValue(null);
    }, [searchParams]);

    //** Render */
    return (
        <div className="flex justify-between items-center">
            <div className="basis-1/2 flex flex-wrap gap-4 items-center">
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
                {searchParams.get("start_date") && searchParams.get("end_date") && (
                    <Button
                        isIconOnly
                        variant="light"
                        color="default"
                        onPress={() => router.push(ROUTE.TARGET)}
                        startContent={<XMarkIcon className="w-4 h-4" />}
                    />
                )}
                <Button onPress={() => handleFilterTargets()}>{TEXT.SUBMIT}</Button>
            </div>

            <Button
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={() => {
                    createTarget({
                        name: TEXT.TARGET,
                        targetAt: new Date().toISOString(),
                    });
                }}
            >
                {TEXT.ADD_TARGET}
            </Button>
        </div>
    );
}

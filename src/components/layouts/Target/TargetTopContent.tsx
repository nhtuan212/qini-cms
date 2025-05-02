"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TargetModal from "./TargetModal";
import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import { DateValue, RangeValue } from "@heroui/react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useTargetStore } from "@/stores/useTargetStore";
import { formatDate } from "@/utils";
import { URL, TEXT } from "@/constants";
import { parseDate } from "@internationalized/date";

export default function TargetTopContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    //** Stores */
    const { getModal } = useModalStore();
    const { emptyTargetById } = useTargetStore();

    //** States */
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

    //** Functions */
    const handleFilterTarget = () => {
        if (!dateRange) {
            return setDateRange(null);
        }

        const startDate = formatDate(new Date(dateRange.start.toString()), "YYYY-MM-DD");
        const endDate = formatDate(new Date(dateRange.end.toString()), "YYYY-MM-DD");
        const rangeValue = `&startDate=${startDate}&endDate=${endDate}`;

        router.push(`${URL.TARGET}?${rangeValue}`);
    };

    const handleCancelSearch = () => {
        router.push(URL.TARGET);
        setDateRange(null);
    };

    //** Effects */
    useEffect(() => {
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (startDate && endDate) {
            setDateRange({
                start: parseDate(startDate),
                end: parseDate(endDate),
            });
        }
    }, [searchParams]);

    //** Render */
    return (
        <div className="flex flex-col items-end gap-4">
            <div className="w-full flex justify-between items-center gap-4">
                <h3 className="title">{TEXT.TARGET}</h3>

                <Button
                    startContent={<PlusIcon className="w-5 h-5" />}
                    onPress={() =>
                        getModal({
                            isOpen: true,
                            size: "5xl",
                            isDismissable: false,
                            modalHeader: TEXT.TARGET,
                            modalBody: <TargetModal />,
                            onClose: () => emptyTargetById(),
                        })
                    }
                >
                    {TEXT.ADD_TARGET}
                </Button>
            </div>

            <div className="w-1/2 flex justify-between items-center gap-4">
                <div className="flex-1">
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                </div>

                <Button onPress={handleFilterTarget}>{TEXT.SUBMIT}</Button>

                {dateRange && (
                    <Button
                        color="default"
                        variant="light"
                        startContent={<XMarkIcon className="w-5 h-5" />}
                        onPress={handleCancelSearch}
                    >
                        {TEXT.CANCEL_SEARCH}
                    </Button>
                )}
            </div>
        </div>
    );
}

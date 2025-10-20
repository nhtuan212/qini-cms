import React, { useState } from "react";
import Button from "./Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants";
import {
    formatDate,
    getWeekDates,
    getCurrentVietnamDate,
    addDaysToVietnamDate,
    subtractDaysFromVietnamDate,
} from "@/utils";

interface WeekDatesProps {
    onCurrentWeekChange: ({ startDate, endDate }: { startDate: string; endDate: string }) => void;
}

export default function WeekDates({ onCurrentWeekChange }: WeekDatesProps) {
    //** Variables */
    const [currentWeek, setCurrentWeek] = useState(() => {
        // Initialize with current date in Ho Chi Minh timezone
        return getCurrentVietnamDate();
    });
    const weekDates = getWeekDates(currentWeek);

    //** Functions */
    const handlePreviousWeek = () => {
        // Subtract 7 days in Ho Chi Minh timezone
        const newWeekDate = subtractDaysFromVietnamDate(currentWeek, 7);
        setCurrentWeek(newWeekDate);

        if (typeof onCurrentWeekChange === "function") {
            const newWeekDates = getWeekDates(newWeekDate);
            onCurrentWeekChange({
                startDate: formatDate(newWeekDates[0], "DD/MM/YYYY"),
                endDate: formatDate(newWeekDates[6], "DD/MM/YYYY"),
            });
        }
    };
    const handleNextWeek = () => {
        // Add 7 days in Ho Chi Minh timezone
        const newWeekDate = addDaysToVietnamDate(currentWeek, 7);
        setCurrentWeek(newWeekDate);

        if (typeof onCurrentWeekChange === "function") {
            const newWeekDates = getWeekDates(newWeekDate);
            onCurrentWeekChange({
                startDate: formatDate(newWeekDates[0], "DD/MM/YYYY"),
                endDate: formatDate(newWeekDates[6], "DD/MM/YYYY"),
            });
        }
    };

    //** Render */
    return (
        <div className="flex justify-between items-center gap-x-2">
            <Button
                variant="bordered"
                size="sm"
                startContent={<ChevronLeftIcon className="w-4 h-4" />}
                onPress={handlePreviousWeek}
            >
                {TEXT.PREVIOUS_WEEK}
            </Button>

            <span className="text-sm text-gray-500">
                {`${formatDate(weekDates[0], "DD/MM/YYYY")} - ${formatDate(weekDates[6], "DD/MM/YYYY")}`}
            </span>

            <Button
                variant="bordered"
                size="sm"
                startContent={<ChevronRightIcon className="w-4 h-4" />}
                onPress={handleNextWeek}
            >
                {TEXT.NEXT_WEEK}
            </Button>
        </div>
    );
}

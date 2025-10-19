import React, { useState } from "react";
import Button from "./Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants";
import { formatDate, getWeekDates } from "@/utils";

interface WeekDatesProps {
    onCurrentWeekChange: ({ startDate, endDate }: { startDate: string; endDate: string }) => void;
}

export default function WeekDates({ onCurrentWeekChange }: WeekDatesProps) {
    //** Variables */
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const weekDates = getWeekDates(currentWeek);

    //** Functions */
    const handlePreviousWeek = () => {
        setCurrentWeek(new Date(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000)));
        if (typeof onCurrentWeekChange === "function") {
            onCurrentWeekChange({
                startDate: formatDate(
                    new Date(weekDates[0].getTime() - 7 * 24 * 60 * 60 * 1000),
                    "DD/MM/YYYY",
                ),
                endDate: formatDate(
                    new Date(weekDates[6].getTime() - 7 * 24 * 60 * 60 * 1000),
                    "DD/MM/YYYY",
                ),
            });
        }
    };
    const handleNextWeek = () => {
        setCurrentWeek(new Date(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000)));
        if (typeof onCurrentWeekChange === "function") {
            onCurrentWeekChange({
                startDate: formatDate(
                    new Date(weekDates[0].getTime() + 7 * 24 * 60 * 60 * 1000),
                    "DD/MM/YYYY",
                ),
                endDate: formatDate(
                    new Date(weekDates[6].getTime() + 7 * 24 * 60 * 60 * 1000),
                    "DD/MM/YYYY",
                ),
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

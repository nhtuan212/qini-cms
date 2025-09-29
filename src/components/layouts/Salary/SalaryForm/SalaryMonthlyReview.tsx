import React, { useEffect } from "react";
import SalaryTotal from "../SalaryTotal";
import Card from "@/components/Card";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { UseFormWatch } from "react-hook-form";
import {
    calculateWorkingDaysInRange,
    formatCurrency,
    calculateWorkingHoursWithBreak,
} from "@/utils";
import { TEXT } from "@/constants";
import { FormSalaryProps } from ".";
import { SalaryTypeProps } from "@/lib/types";

interface SalaryMonthlyReviewProps {
    watch: UseFormWatch<FormSalaryProps>;
}

export default function SalaryMonthlyReview({ watch }: SalaryMonthlyReviewProps) {
    //** Stores */
    const { timeSheetByStaffId, cleanUpTimeSheet } = useTimeSheetStore();

    //** Variables */
    const salary = watch("salary");
    const bonus = watch("bonus") || 0;
    const description = watch("description");
    const dateRange = watch("dateRange");
    const lunchAllowancePerDay = watch("lunchAllowancePerDay") || 0;
    const gasolineAllowancePerDay = watch("gasolineAllowancePerDay") || 0;

    // Calculate working hours with break time deduction
    const { totalWorkingHours, totalBreakHours } = calculateWorkingHoursWithBreak(
        timeSheetByStaffId.data,
    );

    //** Effects */
    useEffect(() => {
        return () => {
            cleanUpTimeSheet();
        };
    }, [cleanUpTimeSheet]);

    //** Render */
    return (
        <Card className="h-full flex flex-col gap-4">
            <h3 className="title text-gray-900 flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5" />
                {TEXT.SALARY_DETAIL}
            </h3>

            <div className="relative h-full space-y-4">
                <Card className="space-y-4 p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                        {TEXT.STAFF_INFORMATION}
                    </h3>

                    <div className="flex justify-between items-center gap-2">
                        <p className="text-gray-500">{TEXT.STAFF_NAME}</p>
                        <b>{timeSheetByStaffId.staffName}</b>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <p className="text-gray-500">{TEXT.SALARY_BY_MONTH}</p>
                        <b>{formatCurrency(salary)}</b>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <p className="text-gray-500">{TEXT.STAFF_STANDARD_WORKING_DAYS}</p>
                        <b>
                            {calculateWorkingDaysInRange(
                                dateRange.start.toString(),
                                dateRange.end.toString(),
                            )}
                        </b>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <p className="text-gray-500">{TEXT.WORKING_HOURS}</p>
                        <div className="text-right">
                            <b>{totalWorkingHours}h</b>
                            {totalBreakHours > 0 && (
                                <p className="text-xs text-gray-400">
                                    (Trừ {totalBreakHours}h nghỉ)
                                </p>
                            )}
                        </div>
                    </div>
                </Card>

                <SalaryTotal
                    salary={salary}
                    salaryType={SalaryTypeProps.MONTHLY}
                    lunchAllowancePerDay={lunchAllowancePerDay}
                    gasolineAllowancePerDay={gasolineAllowancePerDay}
                    workingHours={totalWorkingHours}
                    target={timeSheetByStaffId.totalTarget}
                    bonus={bonus}
                    description={description}
                    startDate={dateRange.start.toString()}
                    endDate={dateRange.end.toString()}
                />
            </div>
        </Card>
    );
}

import React, { useEffect } from "react";
import SalaryTotal from "../SalaryTotal";
import Card from "@/components/Card";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { formatCurrency } from "@/utils";
import { TEXT } from "@/constants";
import { FormSalaryProps } from ".";
import { UseFormWatch } from "react-hook-form";
import { SalaryTypeProps } from "@/lib/types";

interface SalaryHourlyReviewProps {
    watch: UseFormWatch<FormSalaryProps>;
}

export default function SalaryHourlyReview({ watch }: SalaryHourlyReviewProps) {
    //** Stores */
    const { timeSheetByStaffId, cleanUpTimeSheet } = useTimeSheetStore();

    //** Variables */
    const salary = watch("salary");
    const bonus = watch("bonus") || 0;
    const description = watch("description");
    const dateRange = watch("dateRange");

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
                        <p className="text-gray-500">{TEXT.SALARY_BY_HOUR}</p>
                        <b>{formatCurrency(salary)}</b>
                    </div>

                    <div className="flex justify-between items-center gap-2">
                        <p className="text-gray-500">{TEXT.WORKING_HOURS}</p>
                        <b>{formatCurrency(timeSheetByStaffId.totalWorkingHours)}</b>
                    </div>

                    {timeSheetByStaffId.totalTarget > 0 && (
                        <div className="flex justify-between items-center gap-2">
                            <p className="text-gray-500">{TEXT.TARGET}</p>
                            <b>{formatCurrency(timeSheetByStaffId.totalTarget)}</b>
                        </div>
                    )}
                </Card>

                <SalaryTotal
                    salary={salary}
                    salaryType={SalaryTypeProps.HOURLY}
                    workingHours={timeSheetByStaffId.totalWorkingHours}
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

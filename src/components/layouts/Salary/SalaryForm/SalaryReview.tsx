import React, { useEffect } from "react";
import Card from "@/components/Card";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { formatCurrency } from "@/utils";
import { TEXT } from "@/constants";
import { FormSalaryProps } from ".";
import { UseFormWatch } from "react-hook-form";

interface SalaryReviewProps {
    watch: UseFormWatch<FormSalaryProps>;
}

export const SalaryTotal = ({ ...props }: any) => {
    //** Variables */
    const { salary, bonus, description, timeSheetByStaffId } = props;

    const workingHours = props.workingHours || timeSheetByStaffId.totalWorkingHours;
    const totalTarget = props.target * 100 || timeSheetByStaffId.totalTarget;
    const target = props.target || Math.floor(timeSheetByStaffId.totalTarget * 0.01);
    const total = Math.floor(props.totalSalary || salary * workingHours + target + bonus);

    //** Render */
    return (
        <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">{TEXT.TOTAL}</h3>

            <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                <div className="text-gray-500">
                    <p>{TEXT.SALARY_BY_HOUR}</p>
                    <span className="text-sm">
                        {`(${formatCurrency(salary)} * ${workingHours}h)`}
                    </span>
                </div>
                <b>{formatCurrency(salary * workingHours)}</b>
            </Card>

            <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                <div className="text-gray-500">
                    <p>{TEXT.TARGET}</p>
                    <span className="text-sm">{`(${formatCurrency(totalTarget)} * 0.01)`}</span>
                </div>
                <b>{formatCurrency(target)}</b>
            </Card>

            {bonus > 0 && (
                <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                    <div className="text-gray-500">
                        <p>{TEXT.BONUS}</p>
                        {description && (
                            <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                                {description}
                            </p>
                        )}
                    </div>
                    <b>{formatCurrency(bonus)}</b>
                </Card>
            )}

            <Card className="flex justify-between items-center gap-2 bg-primary px-2 py-4 text-white">
                <div>
                    <p>{TEXT.TOTAL}</p>
                </div>
                <b>{formatCurrency(total)}</b>
            </Card>
        </div>
    );
};

export default function SalaryReview({ watch }: SalaryReviewProps) {
    //** Stores */
    const { timeSheetByStaffId, cleanUpTimeSheet } = useTimeSheetStore();

    //** Variables */
    const salary = watch("salary");
    const bonus = watch("bonus") || 0;
    const description = watch("description");
    const totalBonus = Math.floor(timeSheetByStaffId.totalTarget * 0.01) || 0;

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

                    <div className="flex justify-between items-center gap-2">
                        <p className="text-gray-500">{TEXT.TARGET}</p>
                        <b>{formatCurrency(timeSheetByStaffId.totalTarget)}</b>
                    </div>
                </Card>

                <SalaryTotal
                    salary={salary}
                    timeSheetByStaffId={timeSheetByStaffId}
                    totalBonus={totalBonus}
                    bonus={bonus}
                    description={description}
                />
            </div>
        </Card>
    );
}

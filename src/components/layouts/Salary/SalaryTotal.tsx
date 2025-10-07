import React, { useEffect } from "react";
import Card from "@/components/Card";
import {
    calculateWorkingDaysInRange,
    calculateWorkingHoursWithBreak,
    formatCurrency,
    getMonthRangeFromDate,
} from "@/utils";
import { TEXT } from "@/constants";
import { SalaryTypeProps } from "@/lib/types";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";

export interface SalaryTotalProps {
    staffId?: string;
    salary: number;
    paidLeave?: number;
    lunchAllowancePerDay?: number;
    gasolineAllowancePerDay?: number;
    workingHours: number;
    target: number;
    bonus: number;
    salaryType?: SalaryTypeProps;
    description: string;
    startDate: string;
    endDate: string;
}

export default function SalaryTotal(props: SalaryTotalProps) {
    //** Stores */
    const { timeSheetByStaffId, getTimeSheetByStaffId } = useTimeSheetStore();

    //** Variables */
    const {
        staffId,
        salary,
        lunchAllowancePerDay = 0,
        gasolineAllowancePerDay = 0,
        paidLeave = 0,
        workingHours,
        target,
        bonus,
        description,
        salaryType,
        startDate,
        endDate,
    } = props;

    let workingMonth = 0;
    let workingDays = 0;
    let calculatedSalary = 0;
    let total = 0;
    let totalLunch = 0;
    let totalTransport = 0;
    let totalBonus = 0;

    // Calculate working hours with break time deduction
    const { totalBreakHours } = calculateWorkingHoursWithBreak(timeSheetByStaffId.data);

    switch (salaryType) {
        case SalaryTypeProps.MONTHLY: {
            workingMonth = calculateWorkingDaysInRange(
                getMonthRangeFromDate(startDate).firstDayOfMonth,
                getMonthRangeFromDate(endDate).lastDayOfMonth,
            );
            workingDays = calculateWorkingDaysInRange(startDate, endDate);

            const hourlySalaryRate = salary / (workingMonth * 7.5);
            const calculatedTotal = Math.floor(hourlySalaryRate * workingHours);

            totalLunch = lunchAllowancePerDay * (workingDays - paidLeave);
            totalTransport = gasolineAllowancePerDay * (workingDays - paidLeave);
            totalBonus = totalLunch + totalTransport + bonus;

            calculatedSalary = calculatedTotal >= salary ? salary : calculatedTotal;

            total = calculatedSalary + totalBonus;

            break;
        }
        case SalaryTypeProps.HOURLY:
            calculatedSalary = salary * workingHours;
            total = Math.floor(calculatedSalary + target + bonus);

            break;
    }

    //** Effects */
    useEffect(() => {
        staffId &&
            getTimeSheetByStaffId(staffId, {
                startDate,
                endDate,
            });
    }, [getTimeSheetByStaffId, staffId, startDate, endDate]);

    //** Render */
    return (
        <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold">{TEXT.TOTAL}</h3>

            <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                <div className="text-gray-500">
                    <p>
                        {salaryType === SalaryTypeProps.MONTHLY
                            ? TEXT.SALARY_BY_MONTH
                            : TEXT.SALARY_BY_HOUR}
                    </p>
                    <span className="text-sm">
                        {salaryType === SalaryTypeProps.MONTHLY
                            ? `${formatCurrency(salary)} / ${workingMonth} / 7.5h * ${workingHours}h (Trừ ${totalBreakHours}h nghỉ)`
                            : `${formatCurrency(salary)} * ${workingHours}h`}
                    </span>
                </div>

                <b>{formatCurrency(calculatedSalary)}</b>
            </Card>

            {salaryType === SalaryTypeProps.MONTHLY && workingDays > 0 && (
                <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                    <p>{TEXT.WORKING_MONTH}</p>
                    <div className="text-right">
                        <b>{workingMonth}</b>
                    </div>
                </Card>
            )}

            {salaryType === SalaryTypeProps.MONTHLY && workingDays > 0 && (
                <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                    <p>{TEXT.ACTUAL_WORKING_DAYS}</p>
                    <div className="text-right">
                        <b>{workingDays}</b>
                    </div>
                </Card>
            )}

            {paidLeave > 0 && (
                <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                    <p>{TEXT.PAID_LEAVE}</p>
                    <b>{paidLeave}</b>
                </Card>
            )}

            {target > 0 && (
                <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                    <div className="text-gray-500">
                        <p>{TEXT.TARGET}</p>
                        <span className="text-sm">{`(${formatCurrency(target * 100)} * 0.01)`}</span>
                    </div>

                    <b>{formatCurrency(Math.floor(target))}</b>
                </Card>
            )}

            {totalLunch > 0 && (
                <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                    <p>{TEXT.SALARY_BY_LUNCH}</p>
                    <b>{formatCurrency(totalLunch)}</b>
                </Card>
            )}

            {totalTransport > 0 && (
                <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                    <p>{TEXT.SALARY_BY_TRANSPORT}</p>
                    <b>{formatCurrency(totalTransport)}</b>
                </Card>
            )}

            {bonus > 0 && (
                <Card className="flex justify-between items-center gap-2 bg-primary-100 p-2">
                    <p>{TEXT.BONUS}</p>
                    <b>{formatCurrency(bonus)}</b>
                </Card>
            )}

            {description && (
                <Card className="border p-2">
                    <div>
                        <p>{TEXT.NOTE}:</p>
                        <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                            {description}
                        </p>
                    </div>
                </Card>
            )}

            <Card className="flex justify-between items-center gap-2 bg-primary px-2 py-4 text-white">
                <div>{TEXT.TOTAL}</div>

                <b>{formatCurrency(total)}</b>
            </Card>
        </div>
    );
}

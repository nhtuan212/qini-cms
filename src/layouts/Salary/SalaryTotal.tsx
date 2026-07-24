import Card from "@/components/Card";
import {
    calculateWorkingDaysInRange,
    calculateWorkingHoursWithBreak,
    formatCurrency,
    getMonthRangeFromDate,
} from "@/utils";
import { TEXT } from "@/constants";
import { SalaryTypeProps, TimesheetRecordProps } from "@/types";

export interface SalaryTotalProps {
    timeSheetRecords?: TimesheetRecordProps;
    salary: number;
    paidLeave?: number;
    lunchAllowancePerDay?: number;
    gasolineAllowancePerDay?: number;
    workingHours?: number;
    target?: number;
    bonus: number;
    salaryType?: SalaryTypeProps;
    description: string;
    startDate: string;
    endDate: string;
}

export default function SalaryTotal(props: SalaryTotalProps) {
    //** Variables */
    const {
        salary,
        timeSheetRecords,
        lunchAllowancePerDay = 0,
        gasolineAllowancePerDay = 0,
        paidLeave = 0,
        bonus,
        description,
        salaryType,
        target = timeSheetRecords?.totalTarget || 0,
        workingHours = timeSheetRecords?.totalWorkingHours || 0,
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
    const { totalBreakHours } = calculateWorkingHoursWithBreak(timeSheetRecords?.data || []);

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
        default:
            calculatedSalary = salary * workingHours;
            total = Math.floor(calculatedSalary + target * 0.01 + bonus);

            break;
    }

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
                        <span className="text-sm">{`(${formatCurrency(target)} * 0.01)`}</span>
                    </div>

                    <b>{formatCurrency(Math.floor(target * 0.01))}</b>
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
                <div>{TEXT.NET_PAY}</div>

                <b>{formatCurrency(total)}</b>
            </Card>
        </div>
    );
}

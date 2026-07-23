import SalaryHourlyReview from "./SalaryHourlyReview";
import SalaryCalculator from "./SalaryCalculator";
import SalaryMonthlyReview from "./SalaryMonthlyReview";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import { useTimeSheet } from "@/hooks";
import { useForm } from "react-hook-form";
import { getDateTime } from "@/utils";
import { SalaryTypeProps } from "@/types";

export interface FormSalaryProps {
    userId: string;
    dateRange: RangeValue<CalendarDate>;
    salary: number;
    paidLeave: number;
    lunchAllowancePerDay: number;
    gasolineAllowancePerDay: number;
    bonus: number;
    description: string;
}

export default function SalaryForm() {
    //** Stores */
    const { selectedEmployee } = useEmployeeStore();

    //** React hook form */
    const defaultValues = {
        userId: "",
        dateRange: {
            start: getDateTime().firstDayOfMonth,
            end: getDateTime().lastDayOfMonth,
        },
        salary: 0,
        paidLeave: 0,
        lunchAllowancePerDay: 0,
        gasolineAllowancePerDay: 0,
        bonus: 0,
        description: "",
    };

    const { control, handleSubmit, setValue, getValues, watch, reset, trigger } =
        useForm<FormSalaryProps>({
            defaultValues,
        });

    const userId = watch("userId");
    const dateRange = watch("dateRange");

    //** Queries */
    const { timeSheetRecords } = useTimeSheet(userId, {
        startDate: dateRange.start,
        endDate: dateRange.end,
    });

    //** Render */
    const renderSalaryReview = () => {
        if (selectedEmployee?.salaryType === SalaryTypeProps.HOURLY) {
            return <SalaryHourlyReview timeSheetRecords={timeSheetRecords} watch={watch} />;
        }

        return <SalaryMonthlyReview timeSheetRecords={timeSheetRecords} watch={watch} />;
    };

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <SalaryCalculator
                timeSheetRecords={timeSheetRecords}
                control={control}
                setValue={setValue}
                getValues={getValues}
                trigger={trigger}
                reset={reset}
                handleSubmit={handleSubmit}
            />

            {renderSalaryReview()}
        </div>
    );
}

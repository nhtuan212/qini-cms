import React, { useEffect } from "react";
import SalaryHourlyReview from "./SalaryHourlyReview";
import SalaryCalculator from "./SalaryCalculator";
import SalaryMonthlyReview from "./SalaryMonthlyReview";
import Loading from "@/components/Loading";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useForm } from "react-hook-form";
import { getDateTime } from "@/utils";
import { SalaryTypeProps } from "@/lib/types";

export interface FormSalaryProps {
    staffId: string;
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
    const { isLoading, staffById, getStaff } = useStaffStore();
    const { isLoading: isLoadingTimeSheet } = useTimeSheetStore();

    //** React hook form */
    const defaultValues = {
        staffId: "",
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

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    //** Render */
    const renderSalaryReview = () => {
        if (staffById.salaryType === SalaryTypeProps.HOURLY) {
            return <SalaryHourlyReview watch={watch} />;
        }

        return <SalaryMonthlyReview watch={watch} />;
    };

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {(isLoading || isLoadingTimeSheet) && <Loading />}

            <div>
                <SalaryCalculator
                    control={control}
                    setValue={setValue}
                    getValues={getValues}
                    watch={watch}
                    trigger={trigger}
                    reset={reset}
                    handleSubmit={handleSubmit}
                />
            </div>

            <div>{renderSalaryReview()}</div>
        </div>
    );
}

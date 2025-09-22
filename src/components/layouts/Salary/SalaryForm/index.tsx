import React, { useEffect } from "react";
import SalaryReview from "./SalaryReview";
import SalaryCalculator from "./SalaryCalculator";
import Loading from "@/components/Loading";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useForm } from "react-hook-form";
import { getDateTime } from "@/utils";

export interface FormSalaryProps {
    staffId: string;
    dateRange: RangeValue<CalendarDate>;
    salary: number;
    bonus: number;
    description: string;
}

export default function SalaryForm() {
    //** Stores */
    const { isLoading, getStaff } = useStaffStore();
    const { isLoading: isLoadingTimeSheet } = useTimeSheetStore();

    //** React hook form */
    const defaultValues = {
        staffId: "",
        dateRange: {
            start: getDateTime().firstDayOfMonth,
            end: getDateTime().lastDayOfMonth,
        },
        salary: 0,
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
    return (
        <div className="flex">
            {(isLoading || isLoadingTimeSheet) && <Loading />}

            <div className="flex-1">
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

            <div className="flex-1">
                <SalaryReview watch={watch} />
            </div>
        </div>
    );
}

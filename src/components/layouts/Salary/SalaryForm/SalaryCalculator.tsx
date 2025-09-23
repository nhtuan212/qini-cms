"use client";

import React, { useMemo } from "react";
import { Select, SelectItem } from "@/components/Select";
import DateRangePicker from "@/components/DateRangePicker";
import Input, { NumberInput } from "@/components/Input";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { DocumentCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useSalaryStore } from "@/stores/useSalaryStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { formatDate, calculateWorkingDaysInRange, calculateWorkingDays } from "@/utils";
import { TEXT } from "@/constants";
import { FormSalaryProps } from ".";
import {
    Control,
    Controller,
    UseFormSetValue,
    UseFormGetValues,
    UseFormReset,
    UseFormTrigger,
    UseFormHandleSubmit,
    UseFormWatch,
} from "react-hook-form";

interface SalaryCalculatorProps {
    control: Control<FormSalaryProps>;
    setValue: UseFormSetValue<FormSalaryProps>;
    getValues: UseFormGetValues<FormSalaryProps>;
    trigger: UseFormTrigger<FormSalaryProps>;
    watch: UseFormWatch<FormSalaryProps>;
    reset: UseFormReset<FormSalaryProps>;
    handleSubmit: UseFormHandleSubmit<FormSalaryProps>;
}

export default function SalaryCalculator({
    control,
    setValue,
    getValues,
    trigger,
    watch,
    reset,
    handleSubmit,
}: SalaryCalculatorProps) {
    //** Stores */
    const { staff, getStaffById } = useStaffStore();
    const { isLoading, timeSheetByStaffId, getTimeSheetByStaffId, cleanUpTimeSheet } =
        useTimeSheetStore();
    const { isLoading: isLoadingSalary, createSalary } = useSalaryStore();
    const { getAlert } = useAlertStore();

    //** Variables */
    const orderedStaffByActive = useMemo(() => {
        return staff.sort((a, b) => {
            // First priority: active staff before inactive
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;

            // Second priority: sort by updatedAt desc within same active status
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [staff]);

    const staffIdWatched = watch("staffId");
    const dateRangeWatched = watch("dateRange");
    const startDate = dateRangeWatched.start.toString();
    const endDate = dateRangeWatched.end.toString();

    const onSubmit = (data: FormSalaryProps) => {
        const target = Math.floor(timeSheetByStaffId.totalTarget * 0.01);

        // Calculate working days for non-target staff
        const monthlyWorkingDays = calculateWorkingDaysInRange(
            data.dateRange.start.toString(),
            data.dateRange.end.toString(),
        );

        const actualWorkingDays = calculateWorkingDays(timeSheetByStaffId.data); // Ngày công thực tế từ timesheet

        const result = {
            ...data,
            name: TEXT.SALARY_PERIOD,
            target,
            workingHours: timeSheetByStaffId.totalWorkingHours,
            monthlyWorkingDays,
            actualWorkingDays,
            startDate: data.dateRange.start.toString(),
            endDate: data.dateRange.end.toString(),
        };

        createSalary(result).then(() => {
            getAlert({
                isOpen: true,
                type: "success",
                title: TEXT.SALARY_CREATED,
            });

            cleanUpTimeSheet();
            reset();
        });
    };

    //** Render */
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="flex flex-col gap-4">
                <h3 className="title text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    {TEXT.STAFF_INFORMATION}
                </h3>

                <Controller
                    control={control}
                    name="staffId"
                    rules={{
                        required: {
                            value: true,
                            message: TEXT.IS_REQUIRED,
                        },
                    }}
                    render={({ field, formState: { errors } }) => (
                        <Select
                            label={TEXT.SELECT_STAFF}
                            selectedKeys={[field.value]}
                            isInvalid={!!errors?.staffId}
                            errorMessage={<ErrorMessage errors={errors} name={"staffId"} />}
                            onSelectionChange={value => {
                                const staffId = value.currentKey as string;

                                getStaffById(staffId).then(res => {
                                    setValue("salary", res.salary || 25000);
                                });

                                getTimeSheetByStaffId(staffId, {
                                    startDate: formatDate(startDate, "YYYY-MM-DD"),
                                    endDate: formatDate(endDate, "YYYY-MM-DD"),
                                });

                                field.onChange(staffId);
                            }}
                        >
                            {orderedStaffByActive.map(staff => (
                                <SelectItem
                                    key={staff.id}
                                >{`${staff.name} ${staff.isActive ? "" : `(${TEXT.OFF_FROM} ${formatDate(staff.updatedAt)})`}`}</SelectItem>
                            ))}
                        </Select>
                    )}
                />

                <Controller
                    control={control}
                    name="dateRange"
                    render={() => (
                        <DateRangePicker
                            className="w-full"
                            value={getValues("dateRange")}
                            onChange={value => {
                                if (!value) return null;

                                setValue("dateRange", value as RangeValue<CalendarDate>);

                                if (staffIdWatched) {
                                    getTimeSheetByStaffId(staffIdWatched, {
                                        startDate: formatDate(value.start.toString(), "YYYY-MM-DD"),
                                        endDate: formatDate(value.end.toString(), "YYYY-MM-DD"),
                                    });
                                }
                            }}
                        />
                    )}
                />

                <Controller
                    name="salary"
                    control={control}
                    render={({ field }) => (
                        <NumberInput
                            label={TEXT.PERSONAL_SALARY}
                            value={field.value || 0}
                            onValueChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    name="bonus"
                    control={control}
                    render={({ field }) => (
                        <NumberInput
                            label={TEXT.BONUS}
                            value={field.value || 0}
                            onValueChange={value => {
                                setValue("bonus", value);
                                trigger("description");
                            }}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    rules={{
                        validate: value => {
                            if (!value && getValues("bonus") > 0) {
                                return TEXT.NOTE_HAVE_BONUS;
                            }
                            return true;
                        },
                    }}
                    render={({ field, formState: { errors } }) => (
                        <Input
                            label={TEXT.NOTE}
                            type="textarea"
                            isInvalid={!!errors?.description}
                            errorMessage={<ErrorMessage errors={errors} name={"description"} />}
                            {...field}
                            onValueChange={() => {
                                trigger("description");
                            }}
                        />
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    startContent={<DocumentCheckIcon className="w-5 h-5" />}
                    isDisabled={isLoading || isLoadingSalary}
                >
                    {TEXT.SUBMIT}
                </Button>
            </Card>
        </form>
    );
}

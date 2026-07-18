"use client";

import { useMemo } from "react";
import { Select, SelectItem } from "@/components/Select";
import DateRangePicker from "@/components/DateRangePicker";
import Input, { NumberInput } from "@/components/Input";
import Card from "@/components/Card";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { DocumentCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useEmployeeStore } from "@/stores/useEmployeeStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { useSalary, useEmployee } from "@/hooks";
import {
    formatDate,
    calculateWorkingDaysInRange,
    calculateWorkingDays,
    calculateWorkingHoursWithBreak,
    getMonthRangeFromDate,
} from "@/utils";
import { TEXT } from "@/constants";
import { FormSalaryProps } from ".";
import { SalaryTypeProps, TimesheetRecordProps } from "@/types";
import {
    Control,
    Controller,
    UseFormSetValue,
    UseFormGetValues,
    UseFormReset,
    UseFormTrigger,
    UseFormHandleSubmit,
} from "react-hook-form";

interface SalaryCalculatorProps {
    timeSheetRecords: TimesheetRecordProps;
    control: Control<FormSalaryProps>;
    setValue: UseFormSetValue<FormSalaryProps>;
    getValues: UseFormGetValues<FormSalaryProps>;
    trigger: UseFormTrigger<FormSalaryProps>;
    reset: UseFormReset<FormSalaryProps>;
    handleSubmit: UseFormHandleSubmit<FormSalaryProps>;
}

export default function SalaryCalculator({
    timeSheetRecords,
    control,
    setValue,
    getValues,
    trigger,
    reset,
    handleSubmit,
}: SalaryCalculatorProps) {
    //** Stores */
    const { getAlert } = useAlertStore();
    const { setSelectedEmployee, selectedEmployee } = useEmployeeStore();

    //** Queries */
    const { employees } = useEmployee();
    const { isLoading, createSalary } = useSalary();

    //** Variables */
    const orderedEmployeeByActive = useMemo(() => {
        return employees.sort((a, b) => {
            // First priority: active employee before inactive
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;

            // Second priority: different sorting based on active status
            if (a.isActive && b.isActive) {
                // Inactive employee: sort by name alphabetically
                return a.name.localeCompare(b.name);
            } else {
                // Active employee: sort by updatedAt desc (most recent first)
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
        });
    }, [employees]);

    //** Functions */
    const onSubmit = (data: FormSalaryProps) => {
        if (!selectedEmployee) return null;

        const target = Math.floor(timeSheetRecords.totalTarget * 0.01);

        // Calculate working days for non-target employee (excluding holidays)
        const monthRange = getMonthRangeFromDate(data.dateRange.start.toString());
        const workingMonth = calculateWorkingDaysInRange(
            monthRange.firstDayOfMonth,
            monthRange.lastDayOfMonth,
        );
        const workingDay = calculateWorkingDays(timeSheetRecords.data);

        // Calculate working hours
        let workingHours;

        if (selectedEmployee.salaryType === SalaryTypeProps.MONTHLY) {
            workingHours = calculateWorkingHoursWithBreak(timeSheetRecords.data).totalWorkingHours;
        } else {
            workingHours = timeSheetRecords.totalWorkingHours;
        }

        const result = {
            ...data,
            name: TEXT.SALARY_PERIOD,
            target,
            workingHours,
            workingMonth,
            workingDay,
            startDate: data.dateRange.start.toString(),
            endDate: data.dateRange.end.toString(),
        };

        createSalary(result).then(() => {
            getAlert({
                isOpen: true,
                type: "success",
                title: TEXT.SALARY_CREATED,
            });

            reset({
                userId: getValues("userId"),
                salary: getValues("salary"),
                dateRange: getValues("dateRange"),
            });
        });
    };

    //** Render */
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="flex flex-col gap-4">
                <h3 className="title text-gray-900 flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    {TEXT.EMPLOYEE_INFORMATION}
                </h3>

                <Controller
                    control={control}
                    name="userId"
                    rules={{
                        required: {
                            value: true,
                            message: TEXT.IS_REQUIRED,
                        },
                    }}
                    render={({ field, formState: { errors } }) => (
                        <Select
                            label={TEXT.SELECT_EMPLOYEE}
                            selectedKeys={[field.value]}
                            isInvalid={!!errors?.userId}
                            errorMessage={<ErrorMessage errors={errors} name={"userId"} />}
                            onSelectionChange={value => {
                                const userId = value.currentKey as string;

                                field.onChange(userId);

                                reset({
                                    userId: getValues("userId"),
                                    salary: getValues("salary"),
                                    dateRange: getValues("dateRange"),
                                });

                                const currentEmployee = employees.find(
                                    employee => employee.userId === userId,
                                );
                                if (!currentEmployee) return null;

                                // zustand store
                                setSelectedEmployee(currentEmployee);

                                // Use watched salary for the changes
                                setValue("salary", currentEmployee.salary || 25000);
                                setValue("userId", userId);
                            }}
                        >
                            {orderedEmployeeByActive.map(employee => (
                                <SelectItem key={employee.userId}>
                                    {`${employee.name} ${employee.isActive ? "" : `(${TEXT.OFF_FROM} ${formatDate(employee.updatedAt)})`}`}
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                />

                <Controller
                    control={control}
                    name="dateRange"
                    render={() => (
                        <DateRangePicker
                            label={TEXT.DATE_PICKER}
                            className="w-full"
                            value={getValues("dateRange")}
                            onChange={value => {
                                if (!value) return null;

                                setValue("dateRange", value as RangeValue<CalendarDate>);
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

                {selectedEmployee?.salaryType === SalaryTypeProps.MONTHLY && (
                    <>
                        <Controller
                            name="paidLeave"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label={TEXT.PAID_LEAVE}
                                    value={field.value || 0}
                                    onValueChange={field.onChange}
                                />
                            )}
                        />

                        <Controller
                            name="lunchAllowancePerDay"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label={`${TEXT.SALARY_BY_LUNCH} (Mỗi ngày)`}
                                    value={field.value || 0}
                                    onValueChange={field.onChange}
                                />
                            )}
                        />

                        <Controller
                            name="gasolineAllowancePerDay"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label={`${TEXT.SALARY_BY_TRANSPORT} (Mỗi ngày)`}
                                    value={field.value || 0}
                                    onValueChange={field.onChange}
                                />
                            )}
                        />
                    </>
                )}

                <Controller
                    name="bonus"
                    control={control}
                    render={({ field }) => (
                        <NumberInput
                            label={TEXT.BONUS}
                            value={field.value || 0}
                            onValueChange={value => {
                                setValue("bonus", value || 0);
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
                    isDisabled={isLoading}
                >
                    {TEXT.SUBMIT}
                </Button>
            </Card>
        </form>
    );
}

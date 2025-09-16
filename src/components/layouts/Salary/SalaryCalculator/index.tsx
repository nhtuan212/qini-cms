import React, { useEffect, useMemo } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import { Select, SelectItem } from "@/components/Select";
import Input, { NumberInput } from "@/components/Input";
import Loading from "@/components/Loading";
import { CurrencyDollarIcon, DocumentCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useSalaryStore } from "@/stores/useSalaryStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { formatCurrency, formatDate, getDateTime } from "@/utils";
import { TEXT } from "@/constants/text";

interface FormSalary {
    staffId: string;
    dateRange: RangeValue<CalendarDate>;
    salary: number;
    bonus: number;
    description: string;
}

export default function SalaryCalculator() {
    //** Stores */
    const { staff, getStaff } = useStaffStore();
    const { isLoading, timeSheetByStaffId, getTimeSheetByStaffId } = useTimeSheetStore();
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

    //** React hook form */
    const defaultValues = {
        staffId: "",
        dateRange: {
            start: getDateTime().firstDayOfMonth,
            end: getDateTime().lastDayOfMonth,
        },
        salary: 25000,
        bonus: 0,
        description: "",
    };

    const { control, handleSubmit, setValue, getValues, watch, register, reset } =
        useForm<FormSalary>({
            values: defaultValues,
        });

    // Use watch to get live values for form fields
    const watchedStaffId = watch("staffId");
    const watchedSalary = watch("salary");
    const watchedBonus = watch("bonus");
    const watchedDateRange = watch("dateRange");
    const watchedDescription = watch("description");

    const onSubmit = (data: FormSalary) => {
        const result = {
            ...data,
            name: `${TEXT.SALARY_PERIOD} ${formatDate(data.dateRange.start.toString(), "DD/MM/YYYY")} - ${formatDate(data.dateRange.end.toString(), "DD/MM/YYYY")}`,
        };

        createSalary(result).then(() => {
            getAlert({
                isOpen: true,
                type: "success",
                title: TEXT.SALARY_CREATED,
            });

            reset(defaultValues);
        });
    };

    //** Variables */
    const staffId = watchedStaffId;
    const selectedStaff = orderedStaffByActive.find(staff => staff.id === staffId);
    const staffName = selectedStaff
        ? selectedStaff.isActive
            ? selectedStaff.name
            : `${selectedStaff.name} (${TEXT.OFF_FROM} ${formatDate(selectedStaff.updatedAt)})`
        : "";
    const salary = watchedSalary || 0;
    const bonus = watchedBonus || 0;
    const startDate = watchedDateRange.start.toString();
    const endDate = watchedDateRange.end.toString();
    const description = watchedDescription || "";

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    //** Render */
    const renderSalaryDetail = () => {
        const totalSalary = timeSheetByStaffId.totalWorkingHours * salary + bonus || 0;
        const totalBonus = Math.floor(timeSheetByStaffId.totalTarget * 0.01) || 0;

        return (
            <div className="relative space-y-2">
                {isLoading && <Loading />}

                <Card className="flex justify-between items-center p-2 shadow-none flex-wrap">
                    <p className="text-gray-500">{TEXT.STAFF_INFORMATION}</p>
                    <b>{staffName}</b>
                </Card>

                <Card className="flex justify-between items-center p-2 shadow-none flex-wrap">
                    <p className="text-gray-500">{`${TEXT.WORKING_HOURS} (${timeSheetByStaffId.totalWorkingHours}h x ${formatCurrency(salary)})`}</p>
                    <b>{formatCurrency(totalSalary)}</b>
                </Card>

                <Card className="flex justify-between items-center p-2 shadow-none flex-wrap">
                    <p className="text-gray-500">{`${TEXT.TARGET} (${formatCurrency(
                        timeSheetByStaffId.totalTarget,
                    )} * 0.01)`}</p>
                    <b>{formatCurrency(totalBonus)}</b>
                </Card>

                {bonus > 0 && (
                    <Card className="flex justify-between items-center p-2 shadow-none flex-wrap">
                        <div>
                            <p className="text-gray-500">{TEXT.BONUS}:</p>
                            {description && <span className="pl-4 text-sm">{description}</span>}
                        </div>
                        <b>{formatCurrency(bonus)}</b>
                    </Card>
                )}

                <Card className="flex justify-between items-center bg-primary p-2 text-white rounded-lg">
                    <p className="text-lg font-semibold">{TEXT.TOTAL}</p>
                    <b className="text-lg font-semibold">
                        {formatCurrency(totalSalary + totalBonus)}
                    </b>
                </Card>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-xl mx-auto flex flex-col gap-4">
                <Card className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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

                                    // Update the form with the selected staff's salary
                                    const selectedStaff = orderedStaffByActive.find(
                                        staff => staff.id === staffId,
                                    );

                                    // Update the form with the selected staff's salary
                                    setValue(
                                        "salary",
                                        selectedStaff?.salary || defaultValues.salary,
                                    );

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

                                    getTimeSheetByStaffId(getValues("staffId"), {
                                        startDate: formatDate(value.start.toString(), "YYYY-MM-DD"),
                                        endDate: formatDate(value.end.toString(), "YYYY-MM-DD"),
                                    });
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="salary"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label={TEXT.SALARY}
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

                                    getTimeSheetByStaffId(getValues("staffId"), {
                                        startDate: formatDate(startDate, "YYYY-MM-DD"),
                                        endDate: formatDate(endDate, "YYYY-MM-DD"),
                                    });
                                }}
                            />
                        )}
                    />

                    <Input label={TEXT.NOTE} type="textarea" {...register("description")} />
                </Card>

                <Card className="flex flex-col gap-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <CurrencyDollarIcon className="w-5 h-5" />
                            {TEXT.SALARY_DETAIL}
                        </h3>

                        <b className="ml-auto">
                            {`${formatDate(startDate, "DD/MM/YYYY")} - ${formatDate(endDate, "DD/MM/YYYY")}`}
                        </b>
                    </div>

                    {renderSalaryDetail()}
                </Card>

                <Card>
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
            </div>
        </form>
    );
}

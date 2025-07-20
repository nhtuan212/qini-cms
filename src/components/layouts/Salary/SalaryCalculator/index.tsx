import React, { useEffect } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";
import { Select, SelectItem } from "@/components/Select";
import { NumberInput } from "@/components/Input";
import Loading from "@/components/Loading";
import { CurrencyDollarIcon, DocumentCheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { CalendarDate, RangeValue } from "@heroui/react";
import { useStaffStore } from "@/stores/useStaffStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { Controller, useForm } from "react-hook-form";
import { formatCurrency, formatDate, getDateTime } from "@/utils";
import { TEXT } from "@/constants/text";

interface FormSalary {
    staffId: string;
    dateRange: RangeValue<CalendarDate>;
    salary: number;
    instantBonus: number;
}

export default function SalaryCalculator() {
    //** Stores */
    const { staff, getStaff } = useStaffStore();
    const { isLoading, timeSheetByStaffId, getTimeSheetByStaffId } = useTimeSheetStore();

    //** React hook form */
    const defaultValues = {
        staffId: "",
        dateRange: {
            start: getDateTime().firstDayOfMonth,
            end: getDateTime().lastDayOfMonth,
        },
        salary: 25000,
        instantBonus: 0,
    };

    const { control, handleSubmit, setValue, getValues, watch } = useForm<FormSalary>({
        values: defaultValues,
    });

    // Use watch to get live values for form fields
    const watchedStaffId = watch("staffId");
    const watchedSalary = watch("salary");
    const watchedInstantBonus = watch("instantBonus");
    const watchedDateRange = watch("dateRange");

    const onSubmit = (data: FormSalary) => {
        console.log(data);
    };

    //** Variables */
    const staffId = watchedStaffId;
    const staffName = staff.find(staff => staff.id === staffId)?.name;
    const salary = watchedSalary || 0;
    const instantBonus = watchedInstantBonus || 0;
    const startDate = watchedDateRange.start.toString();
    const endDate = watchedDateRange.end.toString();

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    //** Render */
    const renderSalaryDetail = () => {
        const totalSalary = timeSheetByStaffId.totalWorkingHours * salary + instantBonus || 0;
        const totalBonus = Math.floor(timeSheetByStaffId.totalTarget * 0.01) || 0;

        return (
            <div className="relative space-y-2">
                {isLoading && <Loading />}

                <Card className="flex justify-between items-center p-2 shadow-none">
                    <p className="text-gray-500">{TEXT.STAFF_INFORMATION}</p>
                    <b>
                        {staffName &&
                            `${staffName} - ${formatDate(startDate, "DD/MM/YYYY")} - ${formatDate(endDate, "DD/MM/YYYY")}`}
                    </b>
                </Card>

                <Card className="flex justify-between items-center p-2 shadow-none">
                    <p className="text-gray-500">{`${TEXT.WORKING_HOURS} (${timeSheetByStaffId.totalWorkingHours}h x ${formatCurrency(salary)})`}</p>
                    <b>{formatCurrency(totalSalary)}</b>
                </Card>

                <Card className="flex justify-between items-center p-2 shadow-none">
                    <p className="text-gray-500">{`${TEXT.TARGET} (${formatCurrency(
                        timeSheetByStaffId.totalTarget,
                    )} * 0.01)`}</p>
                    <b>{formatCurrency(totalBonus)}</b>
                </Card>

                {instantBonus > 0 && (
                    <Card className="flex justify-between items-center p-2 shadow-none">
                        <p className="text-gray-500">{TEXT.INSTANT_BONUS}</p>
                        <b>{formatCurrency(instantBonus)}</b>
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
            <div className="flex flex-col gap-4">
                <Card className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        {TEXT.STAFF_INFORMATION}
                    </h3>

                    <Controller
                        control={control}
                        name="staffId"
                        render={({ field }) => (
                            <Select
                                label={TEXT.SELECT_STAFF}
                                {...field}
                                onSelectionChange={value => {
                                    const staffId = new Set(value).values().next().value as string;

                                    getTimeSheetByStaffId(staffId, {
                                        startDate: formatDate(startDate, "YYYY-MM-DD"),
                                        endDate: formatDate(endDate, "YYYY-MM-DD"),
                                    });
                                }}
                            >
                                {staff.map(staff => (
                                    <SelectItem key={staff.id}>{staff.name}</SelectItem>
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
                        name="instantBonus"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label={TEXT.INSTANT_BONUS}
                                value={field.value || 0}
                                onValueChange={value => {
                                    setValue("instantBonus", value);

                                    getTimeSheetByStaffId(getValues("staffId"), {
                                        startDate: formatDate(startDate, "YYYY-MM-DD"),
                                        endDate: formatDate(endDate, "YYYY-MM-DD"),
                                    });
                                }}
                            />
                        )}
                    />
                </Card>

                <Card className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <CurrencyDollarIcon className="w-5 h-5" />
                        {TEXT.SALARY_DETAIL}
                    </h3>

                    {renderSalaryDetail()}
                </Card>

                <Card>
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
            </div>
        </form>
    );
}

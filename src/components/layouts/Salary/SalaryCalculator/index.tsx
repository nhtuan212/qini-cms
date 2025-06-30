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
    const { isLoading, timeSheetByStaffId, getTimeSheet } = useTimeSheetStore();

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

    const { control, handleSubmit, setValue, getValues } = useForm<FormSalary>({
        values: defaultValues,
    });

    const onSubmit = (data: FormSalary) => {
        console.log(data);
    };

    //** Variables */
    const staffId = getValues("staffId");
    const staffName = staff.find(staff => staff.id === staffId)?.name;
    const salary = getValues("salary") || 0;
    const instantBonus = getValues("instantBonus") || 0;
    const startDate = getValues("dateRange").start.toString();
    const endDate = getValues("dateRange").end.toString();
    const totalWorkingHours = timeSheetByStaffId.totalWorkingHours || 0;
    const totalSalary = totalWorkingHours * salary + instantBonus || 0;

    //** Effects */
    useEffect(() => {
        getStaff();
    }, [getStaff]);

    //** Render */
    const renderSalaryDetail = () => {
        return (
            <div className="relative space-y-2">
                {isLoading && <Loading />}

                <div className="flex justify-between items-center">
                    <p className="text-gray-500">{TEXT.STAFF_INFORMATION}</p>
                    <b>
                        {staffName &&
                            `${staffName} - ${formatDate(startDate, "DD/MM/YYYY")} - ${formatDate(endDate, "DD/MM/YYYY")} (${timeSheetByStaffId.totalWorkingHours}h)`}
                    </b>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-gray-500">{TEXT.SALARY}</p>
                    <b>{formatCurrency(salary)}</b>
                </div>

                {getValues("instantBonus") > 0 && (
                    <div className="flex justify-between items-center">
                        <p className="text-gray-500">{TEXT.INSTANT_BONUS}</p>
                        <b>{formatCurrency(instantBonus)}</b>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <p className="text-gray-500">{TEXT.TOTAL}</p>
                    <b>{formatCurrency(totalSalary)}</b>
                </div>
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

                                    getTimeSheet({
                                        staffId,
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

                                    getTimeSheet({
                                        staffId: getValues("staffId"),
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

                                    getTimeSheet({
                                        staffId: getValues("staffId"),
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

"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import DatePicker from "@/components/DatePicker";
import CurrencyInput from "@/components/CurrencyInput";
import { Select, SelectItem } from "@/components/Select";
import { useModalStore } from "@/stores/useModalStore";
import {
    ClockIcon,
    CurrencyDollarIcon,
    PlusIcon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useReportsStore } from "@/stores/useReportsStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore } from "@/stores/useShiftsStore";
import { currencyFormat, dateFormat, formatDate, wrongTimeSheet } from "@/utils";
import { timeSheet } from "@/config/apis";
import { TEXT } from "@/constants/text";
import { ROLE } from "@/constants";
import { StaffProps } from "@/types/staffProps";
import { ShiftProps } from "@/types/shiftProps";
import { ReportProps, reportsOnStaffsProps } from "@/types/reportProps";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { DateProps } from "@/lib/types";
import { useProfileStore } from "@/stores/useProfileStore";

type FormValues = {
    date?: DateProps;
    shift: string;
    staff: {
        staffId: string;
        checkIn: string;
        checkOut: string;
    }[];
    description?: string;
    revenue?: number;
    transfer?: number;
    cash?: number;
    deduction?: number;
};

export default function ReportAddNew() {
    //** Stores */
    const { modal, getModal } = useModalStore();
    const { profile } = useProfileStore();
    const { reportById, getReport, createReport, updateReport, resetReport } = useReportsStore();
    const { staff } = useStaffStore();
    const { shifts } = useShiftStore();

    //** Spread syntax */
    const { action } = modal;

    //** States */
    const [amountValue, setAmountValue] = useState<{
        revenue: number;
        transfer: number;
        cash: number;
        deduction: number;
    }>({
        revenue: 0,
        transfer: 0,
        cash: 0,
        deduction: 0,
    });

    //** React hook form */
    const defaultValues = {
        date: reportById.createAt
            ? parseDate(dateFormat(reportById.createAt as Date))
            : today(getLocalTimeZone()),
        shift: reportById.shiftId || "",
        staff: reportById.reportsOnStaffs?.map(item => ({
            staffId: item.staff?.id || "",
            checkIn: item.checkIn || "",
            checkOut: item.checkOut || "",
        })) || [
            {
                staffId: "",
                checkIn: "",
                checkOut: "",
            },
        ],
        revenue: reportById.revenue || 0,
        transfer: reportById.transfer || 0,
        cash: reportById.cash || 0,
        deduction: reportById.deduction || 0,
        description: reportById.description || "",
    };

    const {
        control,
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ values: defaultValues });

    const { fields, append, remove } = useFieldArray({
        name: "staff",
        control,
    });

    const onSubmit = async (data: FormValues) => {
        const revenue = +String(data.revenue).replace(/[^0-9]/g, "") || 0;
        const transfer = +String(data.transfer).replace(/[^0-9]/g, "") || 0;
        const deduction = +String(data.deduction).replace(/[^0-9]/g, "") || 0;
        const cash =
            data.cash && data.cash >= 0
                ? +String(data.cash).replace(/[^0-9]/g, "")
                : revenue - transfer - deduction;
        const createAt = new Date(`${data.date} ${formatDate(null, "HH:mm:ss")}`).toISOString();

        const reports: ReportProps = {
            revenue,
            transfer,
            deduction,
            cash,
            shiftId: data.shift,
            description: data?.description,
            createAt,
        };

        const reportsOnStaffs: reportsOnStaffsProps = data.staff.map(item => ({
            staffId: item.staffId,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            timeWorked:
                Math.abs(
                    new Date(`2024-01-01T${item.checkOut}`).valueOf() -
                        new Date(`2024-01-01T${item.checkIn}`).valueOf(),
                ) /
                (1000 * 60 * 60),
            target: Math.round(revenue / data.staff.length),
            createAt,
        }));

        switch (action) {
            case "create":
                await createReport({
                    reports,
                    reportsOnStaffs,
                });
                break;

            case "update":
                await updateReport({
                    id: reportById.id,
                    reports,
                });
                break;

            default:
                break;
        }

        getModal({
            isOpen: false,
        });
        getReport();
    };

    //** Effects */
    useEffect(() => {
        setAmountValue({
            ...amountValue,
            cash: amountValue.revenue - amountValue.transfer - amountValue.deduction,
        });

        return () => {
            setAmountValue({
                revenue: 0,
                transfer: 0,
                cash: 0,
                deduction: 0,
            });
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amountValue.revenue, amountValue.transfer, amountValue.cash, amountValue.deduction]);

    useEffect(() => {
        if (!modal.isOpen) {
            reset();
            resetReport();
        }
    }, [modal, reset, resetReport]);

    return (
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-column flex-wrap gap-4 my-4">
                <Controller
                    control={control}
                    name="date"
                    rules={{
                        required: `${TEXT.DATE} ${TEXT.IS_REQUIRED}`,
                    }}
                    render={({ field }) => (
                        <DatePicker
                            label={TEXT.DATE_PICKER}
                            isRequired
                            defaultValue={field.value}
                            isInvalid={!!errors.date}
                            onChange={field.onChange}
                            errorMessage={errors.date && errors.date.message}
                        />
                    )}
                />

                <Select
                    className="w-full"
                    startContent={<ClockIcon className="w-5 h-5" />}
                    label={TEXT.WORK_SHIFT}
                    isInvalid={!!errors.shift}
                    {...register("shift", {
                        required: `${TEXT.WORK_SHIFT} ${TEXT.IS_REQUIRED}`,
                    })}
                    errorMessage={errors.shift && <ErrorMessage errors={errors} name={"shift"} />}
                    isDisabled={action === "update"}
                >
                    {shifts.map((item: ShiftProps) => (
                        <SelectItem key={item.id}>{item.name}</SelectItem>
                    ))}
                </Select>

                {fields.map((field, index) => {
                    return (
                        <div
                            key={field.id}
                            className="relative w-full flex justify-between items-center gap-3"
                        >
                            <Select
                                startContent={<UserCircleIcon className="w-5 h-5" />}
                                label={TEXT.STAFF}
                                isInvalid={!!errors.staff?.[index]?.staffId}
                                {...register(`staff.${index}.staffId`, {
                                    required: `${TEXT.STAFF} ${TEXT.IS_REQUIRED}`,
                                })}
                                errorMessage={
                                    errors.staff?.[index]?.staffId && (
                                        <ErrorMessage
                                            errors={errors}
                                            name={`staff.${index}.staffId`}
                                        />
                                    )
                                }
                                isDisabled={action === "update"}
                            >
                                {staff.map((item: StaffProps) => (
                                    <SelectItem key={item.id} value={item.name}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                className="w-full"
                                startContent={<ClockIcon className="w-5 h-5" />}
                                label={TEXT.CHECK_IN}
                                isInvalid={!!`staff.${index}.checkIn`}
                                {...register(`staff.${index}.checkIn`, {
                                    required: `${TEXT.CHECK_IN} ${TEXT.IS_REQUIRED}`,
                                })}
                                errorMessage={
                                    errors.staff?.[index]?.checkIn && (
                                        <ErrorMessage
                                            errors={errors}
                                            name={`staff.${index}.checkIn`}
                                        />
                                    )
                                }
                                isDisabled={action === "update"}
                            >
                                {timeSheet.map(item => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.value}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                className="w-full"
                                startContent={<ClockIcon className="w-5 h-5" />}
                                label={TEXT.CHECK_OUT}
                                isInvalid={!!`staff.${index}.checkOut`}
                                {...register(`staff.${index}.checkOut`, {
                                    required: `${TEXT.CHECK_IN} ${TEXT.IS_REQUIRED}`,

                                    validate: value => {
                                        const isWrongTimeSheet = wrongTimeSheet({
                                            checkIn: getValues(`staff.${index}.checkIn`),
                                            checkOut: value,
                                        });

                                        if (isWrongTimeSheet)
                                            return TEXT.CHECK_OUR_LARGE_THAN_CHECK_IN;

                                        return true;
                                    },
                                })}
                                errorMessage={
                                    errors.staff?.[index]?.checkOut && (
                                        <ErrorMessage
                                            errors={errors}
                                            name={`staff.${index}.checkOut`}
                                        />
                                    )
                                }
                                isDisabled={action === "update"}
                            >
                                {timeSheet.map(item => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.value}
                                    </SelectItem>
                                ))}
                            </Select>
                            {index > 0 && action !== "update" && (
                                <Button
                                    className={clsx(
                                        "absolute -right-2 -top-2",
                                        "min-w-6 h-6 p-0 rounded-full",
                                    )}
                                    onClick={() => remove(index)}
                                >
                                    <XMarkIcon className="w-4" />
                                </Button>
                            )}
                        </div>
                    );
                })}

                {action !== "update" && (
                    <div className="w-full flex justify-end">
                        <Button
                            onClick={() =>
                                append({
                                    staffId: "",
                                    checkIn: "",
                                    checkOut: "",
                                })
                            }
                        >
                            <PlusIcon className="w-5 mr-2" />
                            {TEXT.ADD_STAFF}
                        </Button>
                    </div>
                )}

                <div className="w-full grid grid-cols-3 items-start gap-4">
                    <CurrencyInput
                        className="col-span-3"
                        label={TEXT.TARGET}
                        value={currencyFormat(reportById.revenue as number)}
                        startContent={<CurrencyDollarIcon className="w-5 h-5" />}
                        placeholder={TEXT.TARGET}
                        isDisabled={action === "update"}
                        isInvalid={!!errors.revenue}
                        {...register("revenue", {
                            required: `${TEXT.TARGET} ${TEXT.IS_REQUIRED}`,
                            onChange: e => {
                                setAmountValue({
                                    ...amountValue,
                                    revenue: e.target.value.replace(/[^0-9]/g, ""),
                                });
                            },
                        })}
                        errorMessage={<ErrorMessage errors={errors} name={"revenue"} />}
                    />

                    <CurrencyInput
                        label={TEXT.TRANSFER}
                        value={currencyFormat(reportById.transfer as number)}
                        startContent={<CurrencyDollarIcon className="w-5 h-5" />}
                        placeholder={TEXT.TRANSFER}
                        isDisabled={action === "update"}
                        isInvalid={!!errors.transfer}
                        {...register("transfer", {
                            required: `${TEXT.TRANSFER} ${TEXT.IS_REQUIRED}`,

                            onChange: e => {
                                setAmountValue({
                                    ...amountValue,
                                    transfer: e.target.value.replace(/[^0-9]/g, ""),
                                });
                            },
                        })}
                        errorMessage={<ErrorMessage errors={errors} name={"transfer"} />}
                    />
                    <CurrencyInput
                        label={TEXT.DEDUCTION}
                        value={currencyFormat(
                            (reportById.deduction as number) || amountValue.deduction,
                        )}
                        startContent={<CurrencyDollarIcon className="w-5 h-5" />}
                        placeholder={TEXT.DEDUCTION}
                        isDisabled={action === "update"}
                        isInvalid={!!errors.deduction}
                        {...register("deduction", {
                            required: `${TEXT.DEDUCTION} ${TEXT.IS_REQUIRED}`,

                            onChange: e => {
                                setAmountValue({
                                    ...amountValue,
                                    deduction: e.target.value.replace(/[^0-9]/g, ""),
                                });
                            },
                        })}
                        errorMessage={<ErrorMessage errors={errors} name={"deduction"} />}
                    />
                    <CurrencyInput
                        label={TEXT.CASH}
                        value={currencyFormat((reportById.cash as number) || amountValue.cash)}
                        startContent={<CurrencyDollarIcon className="w-5 h-5" />}
                        placeholder={TEXT.CASH}
                        readOnly={profile.role === "staff"}
                        isDisabled={action === "update" && profile.role !== ROLE.ADMIN}
                        isInvalid={!!errors.cash}
                        {...register("cash", {
                            required: `${TEXT.CASH} ${TEXT.IS_REQUIRED}`,
                            onChange: e => {
                                setAmountValue({
                                    ...amountValue,
                                    cash: e.target.value.replace(/[^0-9]/g, ""),
                                });
                            },
                        })}
                        errorMessage={<ErrorMessage errors={errors} name={"cash"} />}
                    />
                </div>

                <div className="w-full">
                    <Input
                        className="w-full"
                        type="textarea"
                        placeholder={TEXT.NOTE}
                        isInvalid={!!errors.description}
                        {...register("description", {
                            validate: value => {
                                if (amountValue.deduction > 0 && !value) {
                                    return TEXT.NOTE_HAVE_DEDUCTION;
                                }
                                return true;
                            },
                        })}
                        errorMessage={<ErrorMessage errors={errors} name={"description"} />}
                    />
                </div>

                <div className="w-full flex justify-end gap-2">
                    <Button
                        className="bg-white text-default-900 ring-1 ring-inset ring-gray-300"
                        onClick={() =>
                            getModal({
                                isOpen: false,
                            })
                        }
                    >
                        {TEXT.CANCEL}
                    </Button>
                    <Button type="submit">{TEXT.SAVE}</Button>
                </div>
            </div>
        </form>
    );
}

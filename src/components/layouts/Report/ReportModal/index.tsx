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
import { ReportProps, useReportsStore } from "@/stores/useReportsStore";
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore } from "@/stores/useShiftsStore";
import { convertAmountToNumber, currencyFormat, formatDate, wrongTimeSheet } from "@/utils";
import { timeSheet } from "@/config/apis";
import { TEXT } from "@/constants/text";
import { ROLE } from "@/constants";
import { ShiftProps } from "@/types/shiftProps";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { DateProps, ModalActionProps } from "@/lib/types";
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
    const { isLoading, reportById, getReport, createReport, updateReport, resetReport } =
        useReportsStore();
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
            ? parseDate(formatDate(reportById.createAt, "YYYY-MM-DD"))
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
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ values: defaultValues });

    const { fields, append, remove } = useFieldArray({
        name: "staff",
        control,
    });

    const onSubmit = async (data: FormValues) => {
        const revenue = convertAmountToNumber(String(data.revenue));
        const transfer = convertAmountToNumber(String(data.transfer));
        const deduction = convertAmountToNumber(String(data.deduction));
        const cash = data.cash
            ? convertAmountToNumber(String(data.cash))
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

        const reportsOnStaffs: ReportProps = data.staff.map(item => ({
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
            case ModalActionProps.CREATE:
                await createReport({
                    reports,
                    reportsOnStaffs,
                });
                break;

            case ModalActionProps.UPDATE:
                await updateReport({
                    id: reportById.id,
                    reports,
                    reportsOnStaffs,
                });
                break;

            default:
                break;
        }

        getReport();

        getModal({
            isOpen: false,
        });
    };

    //** Effects */
    useEffect(() => {
        setAmountValue({
            ...amountValue,
            ...(amountValue.revenue && {
                cash: amountValue.revenue - amountValue.transfer - amountValue.deduction,
            }),
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amountValue.revenue, amountValue.transfer, amountValue.cash, amountValue.deduction]);

    useEffect(() => {
        return () => {
            setAmountValue({
                revenue: 0,
                transfer: 0,
                cash: 0,
                deduction: 0,
            });
        };
    }, []);

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
                            {...field}
                            isInvalid={!!errors.date}
                            errorMessage={errors.date && errors.date.message}
                        />
                    )}
                />

                <Select
                    className="w-full"
                    startContent={<ClockIcon className="w-5 h-5" />}
                    label={TEXT.WORK_SHIFT}
                    {...register("shift", {
                        required: `${TEXT.DATE} ${TEXT.IS_REQUIRED}`,

                        onChange: e => {
                            setValue("shift", e.target.value);
                        },
                    })}
                    isInvalid={!!errors.shift}
                    errorMessage={errors.shift && <ErrorMessage errors={errors} name={"shift"} />}
                    isDisabled={action === ModalActionProps.UPDATE}
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
                                {...register(`staff.${index}.staffId`, {
                                    required: `${TEXT.STAFF} ${TEXT.IS_REQUIRED}`,

                                    onChange: e => {
                                        setValue(`staff.${index}.staffId`, e.target.value);
                                    },
                                })}
                                isInvalid={!!errors.staff?.[index]?.staffId}
                                errorMessage={
                                    errors.staff?.[index]?.staffId && (
                                        <ErrorMessage
                                            errors={errors}
                                            name={`staff.${index}.staffId`}
                                        />
                                    )
                                }
                                isDisabled={action === ModalActionProps.UPDATE}
                            >
                                {staff.map((item: StaffProps) => (
                                    <SelectItem key={item.id}>{item.name}</SelectItem>
                                ))}
                            </Select>
                            <Select
                                startContent={<UserCircleIcon className="w-5 h-5" />}
                                label={TEXT.CHECK_IN}
                                {...register(`staff.${index}.checkIn`, {
                                    required: `${TEXT.CHECK_IN} ${TEXT.IS_REQUIRED}`,

                                    onChange: e => {
                                        setValue(`staff.${index}.checkIn`, e.target.value);
                                    },
                                })}
                                isInvalid={!!errors.staff?.[index]?.checkIn}
                                errorMessage={
                                    errors.staff?.[index]?.checkIn && (
                                        <ErrorMessage
                                            errors={errors}
                                            name={`staff.${index}.checkIn`}
                                        />
                                    )
                                }
                                isDisabled={action === ModalActionProps.UPDATE}
                            >
                                {timeSheet.map(item => (
                                    <SelectItem key={item.value}>{item.value}</SelectItem>
                                ))}
                            </Select>
                            <Select
                                startContent={<UserCircleIcon className="w-5 h-5" />}
                                label={TEXT.CHECK_OUT}
                                {...register(`staff.${index}.checkOut`, {
                                    required: `${TEXT.CHECK_OUT} ${TEXT.IS_REQUIRED}`,

                                    validate: value => {
                                        const isWrongTimeSheet = wrongTimeSheet({
                                            checkIn: getValues(`staff.${index}.checkIn`),
                                            checkOut: value,
                                        });

                                        if (isWrongTimeSheet)
                                            return TEXT.CHECK_OUR_LARGE_THAN_CHECK_IN;

                                        return true;
                                    },

                                    onChange: e => {
                                        setValue(`staff.${index}.checkOut`, e.target.value);
                                    },
                                })}
                                isInvalid={!!errors.staff?.[index]?.checkOut}
                                errorMessage={
                                    errors.staff?.[index]?.checkOut && (
                                        <ErrorMessage
                                            errors={errors}
                                            name={`staff.${index}.checkOut`}
                                        />
                                    )
                                }
                                isDisabled={action === ModalActionProps.UPDATE}
                            >
                                {timeSheet.map(item => (
                                    <SelectItem key={item.value}>{item.value}</SelectItem>
                                ))}
                            </Select>
                            {index > 0 && action !== ModalActionProps.UPDATE && (
                                <Button
                                    className={clsx(
                                        "absolute -right-2 -top-2",
                                        "min-w-6 h-6 p-0 rounded-full",
                                    )}
                                    onPress={() => remove(index)}
                                >
                                    <XMarkIcon className="w-4" />
                                </Button>
                            )}
                        </div>
                    );
                })}

                {action !== ModalActionProps.UPDATE && (
                    <div className="w-full flex justify-end">
                        <Button
                            onPress={() =>
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
                        isDisabled={action === ModalActionProps.UPDATE}
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
                        isDisabled={action === ModalActionProps.UPDATE}
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
                        isDisabled={action === ModalActionProps.UPDATE}
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
                        isDisabled={
                            action === ModalActionProps.UPDATE && profile.role !== ROLE.ADMIN
                        }
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
                        isLoading={isLoading}
                        onPress={() =>
                            getModal({
                                isOpen: false,
                            })
                        }
                    >
                        {TEXT.CANCEL}
                    </Button>

                    <Button type="submit" isLoading={isLoading}>
                        {TEXT.SAVE}
                    </Button>
                </div>
            </div>
        </form>
    );
}

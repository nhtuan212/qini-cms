"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import moment from "moment";
import Modal from "@/components/Modal";
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
import { currencyFormat, dateFormat2, wrongTimeSheet } from "@/utils";
import { timeSheet } from "@/config/apis";
import { TEXT } from "@/constants/text";
import { MODAL } from "@/constants";
import { StaffProps } from "@/types/staffProps";
import { ShiftProps } from "@/types/shiftProps";
import { ReportProps, reportsOnStaffsProps } from "@/types/reportProps";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { DateProps } from "@/lib/types";

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
};

export default function RevenueAddNew() {
    //** Stores */
    const { modalName, modalAction, openModal } = useModalStore();
    const { reportById, getReport, createReport, updateReport, resetReport } = useReportsStore();
    const { staff } = useStaffStore();
    const { shifts } = useShiftStore();

    //** States */
    const [amountValue, setAmountValue] = useState<{
        revenue: number;
        transfer: number;
        cash: number;
    }>({
        revenue: 0,
        transfer: 0,
        cash: 0,
    });

    //** React hook form */
    const defaultValues = {
        date: reportById.createAt
            ? parseDate(dateFormat2(reportById.createAt as Date))
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
        const cash = revenue - transfer;

        const createAt = data.date
            ? new Date(`${data.date} ${moment().format("HH:mm:ss")}`).toISOString()
            : new Date().toISOString();

        const reports: ReportProps = {
            revenue,
            transfer,
            cash,
            shiftId: data.shift,
            description: data?.description,
            ...((!reportById.createAt || modalAction === "edit") && {
                createAt,
            }),
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
            ...((!reportById.createAt || modalAction === "edit") && {
                createAt,
            }),
        }));

        //** Edit report */
        if (modalAction === "edit") {
            return updateReport({
                id: reportById.id,
                reports,
            }).then(() => {
                openModal("");
                getReport();
            });
        }

        //** Create report */
        createReport({
            reports,
            reportsOnStaffs,
        }).then(() => {
            openModal("");
            getReport();
        });
    };

    //** Effects */
    useEffect(() => {
        setAmountValue({
            ...amountValue,
            cash: amountValue.revenue - amountValue.transfer,
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amountValue.revenue, amountValue.transfer, amountValue.cash]);

    useEffect(() => {
        return () => {
            if (modalName) {
                reset();
                resetReport();
                setAmountValue({
                    revenue: 0,
                    transfer: 0,
                    cash: 0,
                });
            }
        };
    }, [resetReport, reset, modalName, reportById]);

    return (
        <Modal open={modalName === MODAL.ADD_REPORT} size="4xl" onClose={() => openModal("")}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>{TEXT.ADD_REPORT}</Modal.Header>
                <Modal.Body className="relative">
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
                                    defaultValue={
                                        reportById.createAt
                                            ? parseDate(dateFormat2(reportById.createAt as Date))
                                            : today(getLocalTimeZone())
                                    }
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
                            errorMessage={
                                errors.shift && <ErrorMessage errors={errors} name={"shift"} />
                            }
                            isDisabled={modalAction === "edit"}
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
                                        isDisabled={modalAction === "edit"}
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
                                        isDisabled={modalAction === "edit"}
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
                                        isDisabled={modalAction === "edit"}
                                    >
                                        {timeSheet.map(item => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.value}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    {index > 0 && modalAction !== "edit" && (
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

                        {modalAction !== "edit" && (
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

                        <div className="w-full grid grid-cols-2 items-start gap-4">
                            <CurrencyInput
                                className="col-span-2"
                                label={TEXT.TARGET}
                                value={currencyFormat(reportById.revenue as number)}
                                startContent={<CurrencyDollarIcon className="w-5 h-5" />}
                                placeholder={TEXT.TARGET}
                                isDisabled={modalAction === "edit"}
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
                                isDisabled={modalAction === "edit"}
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
                                label={TEXT.CASH}
                                value={currencyFormat(
                                    (reportById.cash as number) || amountValue.cash,
                                )}
                                startContent={<CurrencyDollarIcon className="w-5 h-5" />}
                                placeholder={TEXT.CASH}
                                readOnly
                                isDisabled={modalAction === "edit"}
                            />
                        </div>

                        <div className="w-full">
                            <Input
                                className="w-full"
                                type="textarea"
                                placeholder={TEXT.NOTE}
                                {...register("description")}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex flex-row-reverse gap-2">
                        <Button type="submit">{TEXT.SAVE}</Button>
                        <Button
                            className="bg-white text-default-900 ring-1 ring-inset ring-gray-300"
                            onClick={() => openModal("")}
                        >
                            {TEXT.CANCEL}
                        </Button>
                    </div>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import moment from "moment";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import DatePickerComponent from "@/components/DatePicker";
import Loading from "@/components/Loading";
import { useModalStore } from "@/stores/useModalStore";
import { Select, SelectItem } from "@nextui-org/react";
import {
    ClockIcon,
    CurrencyDollarIcon,
    PlusIcon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useReportsStore } from "@/stores/useReportsStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { useShiftStore } from "@/stores/useShiftsStore";
import { wrongTimeSheet } from "@/utils";
import { timeSheet } from "@/config/apis";
import { TEXT } from "@/constants/text";
import { MODAL } from "@/constants";
import { StaffProps } from "@/types/staffProps";
import { ShiftProps } from "@/types/shiftProps";
import { DateValueType } from "react-tailwindcss-datepicker";
import { ReportProps, reportsOnStaffsProps } from "@/types/reportProps";

type FormValues = {
    shift: string;
    staff: {
        staffId: string;
        checkIn: string;
        checkOut: string;
    }[];
    description?: string;
    revenue: number;
};

export default function RevenueAddNew() {
    //** Stores */
    const { openModal, modalName, modalAction } = useModalStore();
    const {
        getReport,
        createReport,
        updateReport,
        resetReport,
        reportDetail,
        isReportDetailLoading,
    } = useReportsStore();
    const { staff } = useStaffStore();
    const { shifts } = useShiftStore();

    //** States */
    const [dateValue, setDateValue] = useState<DateValueType>({
        startDate: null,
        endDate: null,
    });
    const [shiftValue, setShiftValue] = useState<any>(new Set([]));
    const [reportValue, setReportValue] = useState<any>(new Set([]));

    //** Functions */
    const handleValueChange = (newValue: DateValueType) => {
        setDateValue(newValue);
    };

    //** React hook form */
    const defaultValues = {
        shift: "",
        staff: [],
        description: "",
        revenue: 0,
    };

    const {
        control,
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm<FormValues>({ defaultValues });

    const { fields, append, remove } = useFieldArray({
        name: "staff",
        control,
    });

    const onSubmit = async (data: FormValues) => {
        const reports: ReportProps = {
            revenue: data.revenue,
            shiftId: data.shift,
            description: data?.description,
            ...(!reportDetail.createAt && {
                createAt: dateValue?.startDate
                    ? new Date(
                          `${dateValue?.startDate} ${moment().format("HH:mm:ss")}`,
                      ).toISOString()
                    : new Date().toISOString(),
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
            target: Math.round(data.revenue / data.staff.length),
        }));

        //** Edit report */
        if (modalAction === "edit") {
            return updateReport({
                id: reportDetail.id,
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
        reset({
            shift: reportDetail.shiftId || "",
            staff: reportDetail.reportsOnStaffs?.map(item => ({
                staffId: item.staff?.id,
                checkIn: item.checkIn,
                checkOut: item.checkOut,
            })) || [
                {
                    staffId: "",
                    checkIn: "",
                    checkOut: "",
                },
            ],
            description: reportDetail.description || "",
            revenue: reportDetail.revenue || 0,
        });
    }, [reset, reportDetail]);

    useEffect(() => {
        setShiftValue(new Set([reportDetail.shiftId]));
        setReportValue(
            new Set(
                reportDetail.reportsOnStaffs?.map(item => ({
                    staffId: item.staff?.id,
                    checkIn: item.checkIn,
                    checkOut: item.checkOut,
                })) || [
                    {
                        staffId: "",
                        checkIn: "",
                        checkOut: "",
                    },
                ],
            ),
        );

        return () => {
            setShiftValue(new Set([]));
            setReportValue(new Set([]));
        };
    }, [reportDetail]);

    useEffect(() => {
        return () => {
            //** Reset form */
            reset({
                shift: "",
                staff: [
                    {
                        staffId: "",
                        checkIn: "",
                        checkOut: "",
                    },
                ],
                description: "",
                revenue: 0,
            });

            //** Reset date value */
            setDateValue({ startDate: null, endDate: null });

            //** Reset report detail */
            resetReport();
        };
    }, [modalName, resetReport, reset]);

    useEffect(() => {
        setDateValue({
            startDate: moment(reportDetail.createAt).format("YYYY-MM-DD"),
            endDate: moment(reportDetail.createAt).format("YYYY-MM-DD"),
        });
    }, [reportDetail]);

    return (
        <Modal open={modalName === MODAL.ADD_REPORT} size="4xl" onClose={() => openModal("")}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>{TEXT.ADD_REPORT}</Modal.Header>
                <Modal.Body className="relative">
                    {isReportDetailLoading && <Loading className="absolute w-full h-full" />}
                    <div className="flex flex-column flex-wrap gap-4 my-4">
                        <DatePickerComponent
                            useRange={false}
                            asSingle={true}
                            value={dateValue}
                            onChange={handleValueChange}
                            displayFormat={"DD/MM/YYYY"}
                        />

                        <Controller
                            name="shift"
                            control={control}
                            render={() => (
                                <Select
                                    className="w-full"
                                    startContent={<ClockIcon className="w-6" />}
                                    label={TEXT.WORK_SHIFT}
                                    selectedKeys={shiftValue}
                                    onSelectionChange={(value: any) => setShiftValue(value)}
                                    isDisabled={modalAction === "edit"}
                                    {...register("shift", {
                                        required: `${TEXT.WORK_SHIFT} ${TEXT.IS_REQUIRED}`,
                                    })}
                                    isInvalid={!!errors.shift}
                                    errorMessage={
                                        errors.shift && (
                                            <ErrorMessage errors={errors} name={"shift"} />
                                        )
                                    }
                                >
                                    {shifts.map((item: ShiftProps) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            )}
                        />

                        {fields.map((field, index) => {
                            return (
                                <div
                                    key={field.id}
                                    className="relative w-full flex justify-between items-center gap-3"
                                >
                                    <Controller
                                        name={`staff.${index}.staffId`}
                                        control={control}
                                        render={() => (
                                            <Select
                                                className="w-full"
                                                startContent={<UserCircleIcon className="w-6" />}
                                                label={TEXT.STAFF}
                                                selectedKeys={reportValue[index]}
                                                onSelectionChange={(value: any) =>
                                                    setReportValue(value)
                                                }
                                                isDisabled={modalAction === "edit"}
                                                {...register(`staff.${index}.staffId`, {
                                                    required: `${TEXT.STAFF} ${TEXT.IS_REQUIRED}`,
                                                })}
                                                isInvalid={!!`staff.${index}.staffId`}
                                                errorMessage={
                                                    `staff.${index}.staffId` && (
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name={`staff.${index}.staffId`}
                                                        />
                                                    )
                                                }
                                            >
                                                {staff.map((item: StaffProps) => (
                                                    <SelectItem key={item.id} value={item.name}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <Controller
                                        name={`staff.${index}.checkIn`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={() => (
                                            <Select
                                                className="w-full"
                                                startContent={<ClockIcon className="w-6" />}
                                                label={TEXT.CHECK_IN}
                                                selectedKeys={reportValue[index]}
                                                onSelectionChange={(value: any) =>
                                                    setReportValue(value)
                                                }
                                                isDisabled={modalAction === "edit"}
                                                {...register(`staff.${index}.checkIn`, {
                                                    required: `${TEXT.CHECK_IN} ${TEXT.IS_REQUIRED}`,
                                                })}
                                                isInvalid={!!`staff.${index}.checkIn`}
                                                errorMessage={
                                                    `staff.${index}.checkIn` && (
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name={`staff.${index}.checkIn`}
                                                        />
                                                    )
                                                }
                                            >
                                                {timeSheet.map(item => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.value}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <Controller
                                        name={`staff.${index}.checkOut`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={() => (
                                            <Select
                                                className="w-full"
                                                startContent={<ClockIcon className="w-6" />}
                                                label={TEXT.CHECK_OUT}
                                                selectedKeys={reportValue[index]}
                                                onSelectionChange={(value: any) =>
                                                    setReportValue(value)
                                                }
                                                isDisabled={modalAction === "edit"}
                                                {...register(`staff.${index}.checkOut`, {
                                                    required: `${TEXT.CHECK_IN} ${TEXT.IS_REQUIRED}`,

                                                    validate: value => {
                                                        const isWrongTimeSheet = wrongTimeSheet({
                                                            checkIn: getValues(
                                                                `staff.${index}.checkIn`,
                                                            ),
                                                            checkOut: value,
                                                        });

                                                        if (isWrongTimeSheet)
                                                            return TEXT.CHECK_OUR_LARGE_THAN_CHECK_IN;

                                                        return true;
                                                    },
                                                })}
                                                isInvalid={!!`staff.${index}.checkOut`}
                                                errorMessage={
                                                    `staff.${index}.checkOut` && (
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name={`staff.${index}.checkOut`}
                                                        />
                                                    )
                                                }
                                            >
                                                {timeSheet.map(item => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.value}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {index > 0 && (
                                        <Button
                                            className={clsx(
                                                "absolute -right-2 top-0",
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

                        <div className="w-full">
                            <Controller
                                name={"revenue"}
                                control={control}
                                rules={{ required: true }}
                                render={() => (
                                    <Input
                                        className="w-full"
                                        startContent={<CurrencyDollarIcon className="w-6" />}
                                        placeholder={TEXT.TARGET}
                                        disabled={modalAction === "edit"}
                                        {...register("revenue", {
                                            required: `${TEXT.TARGET} ${TEXT.IS_REQUIRED}`,
                                            pattern: {
                                                value: /^[0-9]+$/i,
                                                message: TEXT.NUMBER_IS_REQUIRED,
                                            },
                                        })}
                                        errorMessage={
                                            <ErrorMessage errors={errors} name={"revenue"} />
                                        }
                                    />
                                )}
                            />
                        </div>

                        <div className="w-full">
                            <Controller
                                name={"description"}
                                control={control}
                                rules={{ required: false }}
                                render={() => (
                                    <Input
                                        className="w-full"
                                        type="textarea"
                                        rows={4}
                                        placeholder={TEXT.NOTE}
                                        {...register("description")}
                                    />
                                )}
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

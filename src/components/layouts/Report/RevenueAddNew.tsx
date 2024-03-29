"use client";

import React from "react";
import clsx from "clsx";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
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
import { useProfileStore } from "@/stores/useProfileStore";
import { useReportStore } from "@/stores/useReportStore";
import { useRevenueStore } from "@/stores/useRevenueStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { fetchData } from "@/utils/fetch";
import { wrongTimeSheet, getHours } from "@/utils";
import { timeSheet } from "@/config/apis";
import { URL } from "@/config/urls";
import { TEXT } from "@/constants/text";
import { MODAL } from "@/constants";
import { StaffProps } from "@/types/staffProps";

type FormValues = {
    staff: {
        staffId: string;
        checkIn: string;
        checkOut: string;
    }[];
    revenue: number;
    multipleErrorInput: any;
};

export default function RevenueAddNew() {
    //** Stores */
    const { profile } = useProfileStore();
    const { openModal, modalName } = useModalStore();
    const { getReport } = useReportStore();
    const { getRevenue } = useRevenueStore();
    const { staff } = useStaffStore();

    //** React hook form */
    const {
        control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            staff: [{ staffId: "", checkIn: "", checkOut: "" }],
        },
        // mode: "onBlur",
        criteriaMode: "all",
    });
    const { fields, append, remove } = useFieldArray({
        name: "staff",
        control,
    });
    const onSubmit = async (data: FormValues) => {
        const revenue: number = Number(data.revenue);
        const target: number = Math.round(revenue / data.staff.length);
        const report: any = [];

        await fetchData({
            endpoint: URL.REVENUE,
            options: {
                method: "POST",
                body: JSON.stringify({ revenue }),
            },
        }).then(revenueRes => {
            if (revenueRes.data) {
                data.staff.forEach(item => {
                    const checkIn = new Date(item.checkIn);
                    const checkOut = new Date(item.checkOut);
                    const timeWorked =
                        Math.abs(checkOut.valueOf() - checkIn.valueOf()) / (1000 * 60 * 60);

                    //** Body Report */
                    report.push({
                        timeWorked,
                        checkIn: getHours(item.checkIn),
                        checkOut: getHours(item.checkOut),
                        target,
                        staffId: item.staffId,
                        revenueId: revenueRes.data.id,
                    });
                });

                //** Create report table */
                fetchData({
                    endpoint: URL.REPORT,
                    options: {
                        method: "POST",
                        body: JSON.stringify(report),
                    },
                }).then(reportRes => {
                    if (reportRes) {
                        openModal("");
                        getReport();
                        getRevenue();
                    }
                });
            }
        });
    };

    return (
        <Modal
            isOpen={modalName === MODAL.ADD_REPORT}
            size="4xl"
            onOpenChange={() => openModal("")}
        >
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>{TEXT.ADD_REPORT}</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-column flex-wrap gap-4 my-4">
                        <div className="w-full flex justify-between items-center">
                            <p>
                                {TEXT.WORK_SHIFT}:{" "}
                                <b className="text-primary">{profile.username}</b>
                            </p>
                            <p>
                                {TEXT.DATE}: {new Date().toDateString()}
                            </p>
                        </div>

                        {fields.map((field, index) => {
                            return (
                                <div
                                    key={field.id}
                                    className="relative w-full flex justify-between items-center gap-3 py-3"
                                >
                                    <Controller
                                        name={`staff.${index}.staffId`}
                                        control={control}
                                        render={() => (
                                            <Select
                                                className="w-full"
                                                startContent={<UserCircleIcon className="w-6" />}
                                                label={TEXT.STAFF}
                                                {...register(`staff.${index}.staffId`, {
                                                    required: `${TEXT.STAFF} ${TEXT.IS_REQUIRED}`,
                                                })}
                                                errorMessage={
                                                    <ErrorMessage
                                                        errors={errors}
                                                        name={`staff.${index}.staffId`}
                                                    />
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
                                                {...register(`staff.${index}.checkIn`, {
                                                    required: `${TEXT.CHECK_IN} ${TEXT.IS_REQUIRED}`,
                                                })}
                                                errorMessage={
                                                    <ErrorMessage
                                                        errors={errors}
                                                        name={`staff.${index}.checkIn`}
                                                    />
                                                }
                                            >
                                                {timeSheet.map(item => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {getHours(item.value)}
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
                                                errorMessage={
                                                    <ErrorMessage
                                                        errors={errors}
                                                        name={`staff.${index}.checkOut`}
                                                    />
                                                }
                                            >
                                                {timeSheet.map(item => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {getHours(item.value)}
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

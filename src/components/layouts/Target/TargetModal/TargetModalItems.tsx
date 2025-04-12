"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Revenue from "./Revenue";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { TimeInput } from "@/components/Input";
import { Select, SelectItem } from "@/components/Select";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { ShiftProps } from "@/stores/useShiftsStore";
import { Controller, useFieldArray } from "react-hook-form";
import { isEmpty, parseTimeString } from "@/utils";
import { TEXT } from "@/constants/text";
import { useTargetStore } from "@/stores/useTargetStore";

type TargetModalItemsProps = {
    shift: ShiftProps;
    control: any;
    errors: any;
    getValues: any;
    setValue: any;
    clearErrors: any;
};

export default function TargetModalItems({ ...props }: TargetModalItemsProps) {
    //** Stores */
    const { staff } = useStaffStore();
    const { targetById } = useTargetStore();

    //** Variables */
    const { shift, control, errors, getValues, setValue, clearErrors } = props;

    //** React hook form */
    const fieldName = `shifts.${shift.id}.staffs`;
    const { fields, append, remove } = useFieldArray({
        control,
        name: fieldName,
    });

    //** Effects */
    useEffect(() => {
        if (isEmpty(fields)) {
            targetById.targetShift?.map((item: ShiftProps) => {
                if (item.shiftId === shift.id) {
                    item.targetStaff.map((staff: StaffProps) => {
                        append({
                            staffId: staff.staffId,
                            checkIn: staff.checkIn,
                            checkOut: staff.checkOut,
                        });
                    });
                }
            });
        }
    });

    //** Render */
    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-md">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h3 className="sm:w-fit w-full font-bold">{shift.name}</h3>
                <Button
                    className="ml-auto"
                    variant="bordered"
                    startContent={<PlusIcon className="w-5 h-5" />}
                    onPress={() =>
                        append({
                            staffId: "",
                            checkIn: shift.checkIn,
                            checkOut: shift.checkOut,
                        })
                    }
                >
                    {TEXT.ADD_STAFF}
                </Button>
            </div>

            <div className="min-h-44 flex flex-col gap-4">
                {fields.map((field, index) => {
                    return (
                        <div
                            key={field.id}
                            className="relative w-full flex justify-between items-center gap-2"
                        >
                            <Controller
                                name={`${fieldName}.${index}.staffId`}
                                control={control}
                                rules={{
                                    required: TEXT.IS_REQUIRED,
                                }}
                                render={({ field }) => {
                                    return (
                                        <Select
                                            label={TEXT.STAFF}
                                            selectedKeys={[field.value]}
                                            onChange={field.onChange}
                                            isInvalid={
                                                !!errors?.shifts?.[shift.id]?.staffs?.[index]
                                                    ?.staffId
                                            }
                                            errorMessage={
                                                errors?.shifts?.[shift.id]?.staffs?.[index]
                                                    ?.staffId && (
                                                    <ErrorMessage
                                                        errors={errors}
                                                        name={`${fieldName}.${index}.staffId`}
                                                    />
                                                )
                                            }
                                        >
                                            {staff.map((item: StaffProps) => (
                                                <SelectItem key={item.id}>{item.name}</SelectItem>
                                            ))}
                                        </Select>
                                    );
                                }}
                            />

                            <Controller
                                name={`${fieldName}.${index}.checkIn`}
                                rules={{
                                    required: TEXT.IS_REQUIRED,

                                    validate: (value: string) => {
                                        const checkOutTime = getValues(
                                            `${fieldName}.${index}.checkOut`,
                                        );

                                        if (value && checkOutTime) {
                                            const [checkInHour, checkInMinute] = value
                                                .split(":")
                                                .map(Number);
                                            const [checkOutHour, checkOutMinute] = checkOutTime
                                                .split(":")
                                                .map(Number);

                                            if (
                                                checkInHour > checkOutHour ||
                                                (checkInHour === checkOutHour &&
                                                    checkInMinute >= checkOutMinute)
                                            ) {
                                                return TEXT.CHECK_OUR_LARGE_THAN_CHECK_IN;
                                            }

                                            clearErrors(`${fieldName}.${index}.checkOut`, {
                                                shouldFocus: true,
                                            });
                                        }
                                        return true;
                                    },
                                }}
                                control={control}
                                render={({ field }) => (
                                    <TimeInput
                                        label={TEXT.CHECK_IN}
                                        value={parseTimeString(field.value)}
                                        onChange={(e: any) => {
                                            if (!e) return;

                                            const timeString = `${e.hour}:${e.minute}`;
                                            field.onChange(timeString);
                                        }}
                                        isRequired={true}
                                        isInvalid={
                                            !!errors?.shifts?.[shift.id]?.staffs?.[index]?.checkIn
                                        }
                                        errorMessage={
                                            errors?.shifts?.[shift.id]?.staffs?.[index]
                                                ?.checkIn && (
                                                <ErrorMessage
                                                    errors={errors}
                                                    name={`${fieldName}.${index}.checkIn`}
                                                />
                                            )
                                        }
                                    />
                                )}
                            />

                            <Controller
                                name={`${fieldName}.${index}.checkOut`}
                                rules={{
                                    required: TEXT.IS_REQUIRED,

                                    validate: (value: string) => {
                                        const checkInTime = getValues(
                                            `${fieldName}.${index}.checkIn`,
                                        );

                                        if (value && checkInTime) {
                                            const [checkInHour, checkInMinute] = checkInTime
                                                .split(":")
                                                .map(Number);
                                            const [checkOutHour, checkOutMinute] = value
                                                .split(":")
                                                .map(Number);

                                            if (
                                                checkOutHour < checkInHour ||
                                                (checkOutHour === checkInHour &&
                                                    checkOutMinute <= checkInMinute)
                                            ) {
                                                return TEXT.CHECK_OUR_LARGE_THAN_CHECK_IN;
                                            }

                                            clearErrors(`${fieldName}.${index}.checkIn`, {
                                                shouldFocus: true,
                                            });
                                        }
                                        return true;
                                    },
                                }}
                                control={control}
                                render={({ field }) => (
                                    <TimeInput
                                        label={TEXT.CHECK_OUT}
                                        value={parseTimeString(field.value)}
                                        onChange={(e: any) => {
                                            if (!e) return;

                                            const timeString = `${e.hour}:${e.minute}`;
                                            field.onChange(timeString);
                                        }}
                                        isRequired={true}
                                        isInvalid={
                                            !!errors?.shifts?.[shift.id]?.staffs?.[index]?.checkOut
                                        }
                                        errorMessage={
                                            errors?.shifts?.[shift.id]?.staffs?.[index]
                                                ?.checkOut && (
                                                <ErrorMessage
                                                    errors={errors}
                                                    name={`${fieldName}.${index}.checkOut`}
                                                />
                                            )
                                        }
                                    />
                                )}
                            />

                            <Button
                                className={twMerge(
                                    "absolute -right-2 -top-2",
                                    "min-w-6 h-6 p-0 rounded-full",
                                )}
                                onPress={() => remove(index)}
                            >
                                <XMarkIcon className="w-4" />
                            </Button>
                        </div>
                    );
                })}
            </div>

            {shift.isTarget && (
                <Revenue
                    control={control}
                    errors={errors}
                    shiftId={shift.id}
                    setValue={setValue}
                    clearErrors={clearErrors}
                />
            )}
        </div>
    );
}

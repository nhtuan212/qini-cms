import React from "react";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { Select, SelectItem } from "@/components/Select";
import { TimeInput } from "@/components/Input";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TargetShiftProps } from "@/stores/useTargetShiftStore";
import { StaffProps, useStaffStore } from "@/stores/useStaffStore";
import { useTimeSheetStore } from "@/stores/useTimeSheetStore";
import { useModalStore } from "@/stores/useModalStore";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { calculateWorkingHours, parseTimeString } from "@/utils";
import { TEXT } from "@/constants";

type TimeSheetForm = {
    timeSheets: StaffProps[];
};

export default function TimeSheetModal({ targetShift }: { targetShift: TargetShiftProps }) {
    //** Stores */
    const { staff } = useStaffStore();
    const { getModal } = useModalStore();
    const { createTimeSheet } = useTimeSheetStore();

    //** React hook form */Add commentMore actions
    const defaultValues: TimeSheetForm = {
        timeSheets: [
            {
                staffId: "",
                checkIn: targetShift.startTime,
                checkOut: targetShift.endTime,
            },
        ],
    };

    const {
        control,
        handleSubmit,
        getValues,
        clearErrors,
        formState: { errors },
    } = useForm<TimeSheetForm>({ values: defaultValues });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "timeSheets",
    });

    const onSubmit = async (data: TimeSheetForm) => {
        const result = data.timeSheets.map(item => ({
            staffId: item.staffId,
            shiftId: targetShift.shiftId,
            targetShiftId: targetShift.id,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            workingHours: calculateWorkingHours(item.checkIn, item.checkOut),
        }));

        await createTimeSheet(result);

        await getModal({
            isOpen: false,
        });
    };

    //** Render */
    return (
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="max-h-[90vh] flex flex-col gap-8 overflow-auto">
                <div className="flex justify-end">
                    <Button
                        onPress={() =>
                            append({
                                staffId: "",
                                checkIn: targetShift.startTime,
                                checkOut: targetShift.endTime,
                            })
                        }
                    >
                        {TEXT.ADD_TIME_SHEET}
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="relative w-full flex justify-between items-center gap-2"
                    >
                        <Controller
                            name={`timeSheets.${index}.staffId`}
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
                                        isInvalid={!!errors?.timeSheets?.[index]?.staffId}
                                        errorMessage={
                                            errors?.timeSheets?.[index]?.staffId && (
                                                <ErrorMessage
                                                    errors={errors}
                                                    name={`timeSheets.${index}.staffId`}
                                                />
                                            )
                                        }
                                    >
                                        {staff.map(item => (
                                            <SelectItem key={item.id}>{item.name}</SelectItem>
                                        ))}
                                    </Select>
                                );
                            }}
                        />

                        <Controller
                            name={`timeSheets.${index}.checkIn`}
                            rules={{
                                required: TEXT.IS_REQUIRED,

                                validate: (value: string) => {
                                    const checkOutTime = getValues(`timeSheets.${index}.checkOut`);

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

                                        clearErrors(`timeSheets.${index}.checkOut`);
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
                                    isInvalid={!!errors?.timeSheets?.[index]?.checkIn}
                                    errorMessage={
                                        errors?.timeSheets?.[index]?.checkIn && (
                                            <ErrorMessage
                                                errors={errors}
                                                name={`timeSheets.${index}.checkIn`}
                                            />
                                        )
                                    }
                                />
                            )}
                        />

                        <Controller
                            name={`timeSheets.${index}.checkOut`}
                            rules={{
                                required: TEXT.IS_REQUIRED,

                                validate: (value: string) => {
                                    const checkInTime = getValues(`timeSheets.${index}.checkIn`);

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

                                        clearErrors(`timeSheets.${index}.checkIn`);
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
                                    isInvalid={!!errors?.timeSheets?.[index]?.checkOut}
                                    errorMessage={
                                        errors?.timeSheets?.[index]?.checkOut && (
                                            <ErrorMessage
                                                errors={errors}
                                                name={`timeSheets.${index}.checkOut`}
                                            />
                                        )
                                    }
                                />
                            )}
                        />

                        <Button
                            className={twMerge(
                                "absolute right-0 -top-3",
                                "min-w-6 h-6 p-0 rounded-full",
                            )}
                            onPress={() => remove(index)}
                        >
                            <XMarkIcon className="w-4" />
                        </Button>
                    </div>
                ))}

                <div className=" sticky bottom-0 w-full flex justify-end gap-2 bg-white">
                    <Button
                        isLoading={false}
                        color="default"
                        onPress={() =>
                            getModal({
                                isOpen: false,
                            })
                        }
                    >
                        {TEXT.CANCEL}
                    </Button>

                    <Button isLoading={false} type="submit">
                        {TEXT.SAVE}
                    </Button>
                </div>
            </div>
        </form>
    );
}

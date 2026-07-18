import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { Autocomplete, AutocompleteItem } from "@/components/AutoComplete";
import { TimeInput } from "@/components/Input";
import { useModalStore } from "@/stores/useModalStore";
import { useEmployee, useTimeSheet } from "@/hooks";
import { Controller, useForm } from "react-hook-form";
import { isEmpty, parseTimeString } from "@/utils";
import { TEXT } from "@/constants";
import { TargetShiftProps, TimesheetData } from "@/types";

type TimeSheetForm = Pick<TimesheetData, "userId" | "checkIn" | "checkOut">;

export default function TimeSheetModal({
    currentTimeSheet,
    targetAt,
    targetShift,
}: {
    currentTimeSheet?: TimesheetData;
    targetAt: string;
    targetShift: TargetShiftProps;
}) {
    //** Stores */
    const { getModal } = useModalStore();

    //** Queries */
    const { employees } = useEmployee();
    const { createTimeSheet, updateTimeSheet } = useTimeSheet();

    //** Variables */
    const isUpdate = currentTimeSheet && !isEmpty(currentTimeSheet);

    //** React hook form */
    const defaultValues: TimeSheetForm = {
        userId: isUpdate ? currentTimeSheet?.userId : "",
        checkIn: isUpdate ? currentTimeSheet?.checkIn : targetShift.startTime,
        checkOut: isUpdate ? currentTimeSheet?.checkOut : targetShift.endTime,
    };

    const {
        control,
        handleSubmit,
        getValues,
        clearErrors,
        formState: { errors },
    } = useForm<TimeSheetForm>({ values: defaultValues });

    const onSubmit = async (data: TimeSheetForm) => {
        const { userId, checkIn, checkOut } = data;

        const result = {
            userId,
            checkIn,
            checkOut,
            shiftId: targetShift.shiftId,
            targetShiftId: targetShift.id,
            date: targetAt,
        };

        if (currentTimeSheet) {
            await updateTimeSheet({
                id: currentTimeSheet.id,
                params: result,
            });
        } else {
            await createTimeSheet(result);
        }

        await getModal({
            isOpen: false,
        });
    };

    //** Render */
    return (
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="max-h-[90vh] flex flex-col gap-8 overflow-auto">
                <div className="relative w-full flex justify-between items-center gap-2">
                    <Controller
                        name={"userId"}
                        control={control}
                        rules={{
                            required: TEXT.IS_REQUIRED,
                        }}
                        render={({ field }) => {
                            return (
                                <Autocomplete
                                    label={TEXT.EMPLOYEE}
                                    defaultSelectedKey={currentTimeSheet?.userId || field.value}
                                    {...field}
                                    isInvalid={!!errors?.userId}
                                    onSelectionChange={field.onChange}
                                    errorMessage={
                                        errors?.userId && (
                                            <ErrorMessage errors={errors} name={"userId"} />
                                        )
                                    }
                                >
                                    {employees.map(item => (
                                        <AutocompleteItem key={item.userId}>
                                            {item.name}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            );
                        }}
                    />

                    <Controller
                        name={"checkIn"}
                        rules={{
                            required: !isUpdate && TEXT.IS_REQUIRED,

                            validate: (value: string) => {
                                const checkOutTime = getValues("checkOut");

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

                                    clearErrors("checkOut");
                                }
                                return true;
                            },
                        }}
                        control={control}
                        render={({ field }) => (
                            <TimeInput
                                label={TEXT.CHECK_IN}
                                value={parseTimeString(field.value)}
                                onChange={e => {
                                    if (!e) return;

                                    const timeString = `${e.hour}:${e.minute}`;
                                    field.onChange(timeString);
                                }}
                                isRequired={true}
                                isInvalid={!!errors?.checkIn}
                                errorMessage={
                                    errors?.checkIn && (
                                        <ErrorMessage errors={errors} name={"checkIn"} />
                                    )
                                }
                            />
                        )}
                    />

                    <Controller
                        name={"checkOut"}
                        rules={{
                            required: !isUpdate && TEXT.IS_REQUIRED,

                            validate: (value: string) => {
                                const checkInTime = getValues("checkIn");

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

                                    clearErrors("checkIn");
                                }

                                return true;
                            },
                        }}
                        control={control}
                        render={({ field }) => (
                            <TimeInput
                                label={TEXT.CHECK_OUT}
                                value={parseTimeString(field.value)}
                                onChange={e => {
                                    if (!e) return;

                                    const timeString = `${e.hour}:${e.minute}`;
                                    field.onChange(timeString);
                                }}
                                isRequired={true}
                                isInvalid={!!errors?.checkOut}
                                errorMessage={
                                    errors?.checkOut && (
                                        <ErrorMessage errors={errors} name={"checkOut"} />
                                    )
                                }
                            />
                        )}
                    />
                </div>

                <div className=" sticky bottom-0 w-full flex justify-end gap-2 bg-white">
                    <Button
                        color="default"
                        onPress={() =>
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

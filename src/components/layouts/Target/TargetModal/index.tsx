"use client";

import React, { useMemo } from "react";
import { transformTargetFormData } from "./targetFormData";
import TargetModalItems from "./TargetModalItems";
import DatePicker from "@/components/DatePicker";
import Button from "@/components/Button";
import { ShiftProps, useShiftStore } from "@/stores/useShiftsStore";
import { useModalStore } from "@/stores/useModalStore";
import { Controller, useForm } from "react-hook-form";
import { TEXT } from "@/constants/text";
import { ModalActionProps } from "@/lib/types";
import { isEmpty } from "@/utils";
import { TargetProps, useTargetStore } from "@/stores/useTargetStore";

export default function TargetModal() {
    //** Stores */
    const { shifts } = useShiftStore();
    const { modal, getModal } = useModalStore();
    const { isLoading, targetById, createTarget, updateTarget } = useTargetStore();

    //** Variables */
    const { action } = modal;

    //** React hook form */
    const defaultValues = useMemo(() => {
        return transformTargetFormData(targetById);
    }, [targetById]);

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<TargetProps>({ values: defaultValues });

    const onSubmit = (data: TargetProps) => {
        const result = {
            ...data,
            targetAt: data.targetAt.toString(),
        };

        if (action === ModalActionProps.UPDATE) {
            return updateTarget({
                id: targetById.id,
                bodyParams: result,
            }).then(res => {
                if (res?.code !== 200) {
                    console.log("Error creating target:", res?.message);
                }

                return getModal({
                    isOpen: false,
                });
            });
        }

        createTarget(result).then(res => {
            if (res?.code !== 200) {
                console.log("Error creating target:", res?.message);
            }

            getModal({
                isOpen: false,
            });

            return res;
        });
    };

    //** Render */
    return (
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="max-h-[90vh] flex flex-col gap-8 overflow-auto">
                <Controller
                    control={control}
                    name="targetAt"
                    rules={{
                        required: TEXT.IS_REQUIRED,
                    }}
                    render={({ field }) => (
                        <DatePicker
                            className="w-full max-w-72"
                            label={TEXT.DATE_PICKER}
                            {...field}
                            isInvalid={!!errors.targetAt}
                            errorMessage={errors.targetAt?.message?.toString()}
                        />
                    )}
                />

                {!isEmpty(shifts) && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {shifts.map((shift: ShiftProps) => {
                            return (
                                <TargetModalItems
                                    key={shift.id}
                                    shift={shift}
                                    control={control}
                                    errors={errors}
                                    getValues={getValues}
                                    setValue={setValue}
                                    clearErrors={clearErrors}
                                />
                            );
                        })}
                    </div>
                )}

                <div className=" sticky bottom-0 w-full flex justify-end gap-2 bg-white">
                    <Button
                        isLoading={isLoading}
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

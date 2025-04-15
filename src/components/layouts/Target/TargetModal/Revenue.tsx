"use client";

import React, { useEffect } from "react";
import Input, { NumberInput } from "@/components/Input";
import { Controller, useWatch } from "react-hook-form";
import { TEXT } from "@/constants/text";
import ErrorMessage from "@/components/ErrorMessage";

type RevenueProps = {
    control: any;
    errors: any;
    shiftId: string;
    setValue: any;
    clearErrors: any;
};

export default function Revenue({ ...props }: RevenueProps) {
    //** Variables */
    const { shiftId, control, errors, setValue, clearErrors } = props;

    //** React hook form */
    const revenue = useWatch({ control, name: `shifts.${shiftId}.revenue` });
    const transfer = useWatch({ control, name: `shifts.${shiftId}.transfer` });
    const deduction = useWatch({ control, name: `shifts.${shiftId}.deduction` });

    //** Effects */
    useEffect(() => {
        const r = parseFloat(revenue) || 0;
        const t = parseFloat(transfer) || 0;
        const d = parseFloat(deduction) || 0;
        setValue(`shifts.${shiftId}.revenue`, r);
        setValue(`shifts.${shiftId}.transfer`, t);
        setValue(`shifts.${shiftId}.deduction`, d);
        setValue(`shifts.${shiftId}.cash`, r - t - d);
    }, [revenue, transfer, deduction, setValue, shiftId]);

    //** Render */
    return (
        <div className="grid sm:grid-cols-3 grid-cols gap-2">
            <Controller
                control={control}
                name={`shifts.${shiftId}.revenue`}
                render={({ field }) => (
                    <NumberInput
                        className="sm:col-span-3"
                        label={TEXT.REVENUE}
                        minValue={0}
                        defaultValue={0}
                        value={field.value || 0}
                        onValueChange={field.onChange}
                    />
                )}
            />

            <Controller
                control={control}
                name={`shifts.${shiftId}.transfer`}
                render={({ field }) => (
                    <NumberInput
                        label={TEXT.TRANSFER}
                        minValue={0}
                        defaultValue={0}
                        value={field.value || 0}
                        onValueChange={field.onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name={`shifts.${shiftId}.deduction`}
                render={({ field }) => (
                    <NumberInput
                        label={TEXT.DEDUCTION}
                        minValue={0}
                        defaultValue={0}
                        value={field.value || 0}
                        onValueChange={(value: any) => {
                            field.onChange(value);

                            if (!value) {
                                field.onChange(0);
                                clearErrors(`shifts.${shiftId}.description`);
                            }
                        }}
                    />
                )}
            />
            <Controller
                control={control}
                name={`shifts.${shiftId}.cash`}
                render={({ field }) => (
                    <NumberInput
                        label={TEXT.CASH}
                        minValue={0}
                        defaultValue={0}
                        value={field.value || 0}
                        onValueChange={field.onChange}
                    />
                )}
            />

            <Controller
                control={control}
                name={`shifts.${shiftId}.description`}
                rules={{
                    validate: value => {
                        if (!value && deduction > 0) {
                            return TEXT.NOTE_HAVE_DEDUCTION;
                        }
                        return true;
                    },
                }}
                render={({ field }) => (
                    <Input
                        className="sm:col-span-3"
                        type="textarea"
                        placeholder={TEXT.NOTE}
                        {...field}
                        value={field.value || ""}
                        isInvalid={!!errors.shifts?.[shiftId]?.description && deduction}
                        errorMessage={
                            <ErrorMessage errors={errors} name={`shifts.${shiftId}.description`} />
                        }
                    />
                )}
            />
        </div>
    );
}

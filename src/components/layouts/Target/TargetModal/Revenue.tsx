"use client";

import React, { useEffect } from "react";
import Input, { NumberInput } from "@/components/Input";
import { Controller, useWatch } from "react-hook-form";
import { TEXT } from "@/constants";
import ErrorMessage from "@/components/ErrorMessage";

type RevenueProps = {
    fieldName: string;
    nestIndex: number;
    control: any;
    errors: any;
    setValue: any;
    clearErrors: any;
};

export default function Revenue({ ...props }: RevenueProps) {
    //** Variables */
    const { fieldName, nestIndex, control, errors, setValue, clearErrors } = props;

    //** React hook form */
    const revenue = useWatch({ control, name: `${fieldName}.revenue` });
    const transfer = useWatch({ control, name: `${fieldName}.transfer` });
    const deduction = useWatch({ control, name: `${fieldName}.deduction` });

    //** Effects */
    useEffect(() => {
        const r = parseFloat(revenue) || 0;
        const t = parseFloat(transfer) || 0;
        const d = parseFloat(deduction) || 0;

        setValue(`${fieldName}.revenue`, r);
        setValue(`${fieldName}.transfer`, t);
        setValue(`${fieldName}.deduction`, d);
        setValue(`${fieldName}.cash`, r - t - d);
    }, [revenue, transfer, deduction, setValue, fieldName]);

    //** Render */
    return (
        <div className="grid sm:grid-cols-3 grid-cols gap-2">
            <Controller
                control={control}
                name={`${fieldName}.revenue`}
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
                name={`${fieldName}.transfer`}
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
                name={`${fieldName}.deduction`}
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
                                clearErrors(`${fieldName}.description`);
                            }
                        }}
                    />
                )}
            />
            <Controller
                control={control}
                name={`${fieldName}.cash`}
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
                name={`${fieldName}.description`}
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
                        isInvalid={!!errors?.targetShift?.[nestIndex]?.description}
                        errorMessage={
                            <ErrorMessage errors={errors} name={`${fieldName}.description`} />
                        }
                    />
                )}
            />
        </div>
    );
}

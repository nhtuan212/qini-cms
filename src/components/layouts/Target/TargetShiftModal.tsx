import React, { useEffect } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import Input, { NumberInput } from "@/components/Input";
import { TargetProps } from "@/stores/useTargetStore";
import { useModalStore } from "@/stores/useModalStore";
import { useTargetShiftStore } from "@/stores/useTargetShiftStore";
import { Controller, useForm, useWatch } from "react-hook-form";
import { TEXT } from "@/constants";

export default function TargetShiftModal() {
    //** Stores */
    const { isLoading, targetShift, updateTargetShift } = useTargetShiftStore();
    const { getModal } = useModalStore();

    //** React hook form */
    const defaultValues = {
        revenue: targetShift.revenue || 0,
        transfer: targetShift.transfer || 0,
        point: targetShift.point || 0,
        deduction: targetShift.deduction || 0,
        cash: targetShift.cash || 0,
        description: targetShift.description || "",
    };

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<TargetProps["targetShift"]>({ values: defaultValues });

    const watchedValues = useWatch({
        control,
        name: ["revenue", "transfer", "point", "deduction"],
    });

    //** Functions */
    const onSubmit = async (data: TargetProps["targetShift"]) => {
        await updateTargetShift({
            id: targetShift.id,
            bodyParams: data,
        });

        await getModal({
            isOpen: false,
        });
    };

    //** Effects */
    useEffect(() => {
        const r = parseFloat(watchedValues[0]) || 0;
        const t = parseFloat(watchedValues[1]) || 0;
        const p = parseFloat(watchedValues[2]) || 0;
        const d = parseFloat(watchedValues[3]) || 0;

        setValue("cash", r - t - p - d);
    }, [watchedValues, setValue]);

    //** Render */
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 grid-cols gap-2">
                <Controller
                    control={control}
                    name="revenue"
                    render={({ field }) => (
                        <NumberInput
                            className="col-span-2"
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
                    name="transfer"
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
                    name="point"
                    render={({ field }) => (
                        <NumberInput
                            label={TEXT.POINT}
                            variant="flat"
                            color="secondary"
                            minValue={0}
                            defaultValue={0}
                            value={field.value || 0}
                            isReadOnly={true}
                            onValueChange={field.onChange}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="deduction"
                    render={({ field }) => (
                        <NumberInput
                            label={TEXT.DEDUCTION}
                            minValue={0}
                            defaultValue={0}
                            value={field.value || 0}
                            onValueChange={(value: any) => {
                                field.onChange(value);

                                if (!value) {
                                    setValue("cash", 0);
                                    clearErrors("description");
                                }
                            }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="cash"
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
                    name="description"
                    rules={{
                        validate: value => {
                            if (!value && getValues("deduction") > 0) {
                                return TEXT.NOTE_HAVE_DEDUCTION;
                            }
                            return true;
                        },
                    }}
                    render={({ field }) => (
                        <Input
                            className="col-span-2"
                            type="textarea"
                            placeholder={TEXT.NOTE}
                            {...field}
                            value={field.value || ""}
                            isInvalid={!!errors?.description}
                            errorMessage={<ErrorMessage errors={errors} name={"description"} />}
                        />
                    )}
                />
            </div>

            <div className="sticky bottom-0 w-full flex justify-end gap-2 bg-white mt-4">
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

                <Button isLoading={isLoading} type="submit">
                    {TEXT.SAVE}
                </Button>
            </div>
        </form>
    );
}

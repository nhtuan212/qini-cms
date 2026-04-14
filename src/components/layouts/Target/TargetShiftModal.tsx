import React, { useEffect } from "react";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import Input, { NumberInput } from "@/components/Input";
import { useModalStore } from "@/stores/useModalStore";
import { useTargetShift } from "@/hooks";
import { Controller, useForm, useWatch } from "react-hook-form";
import { TEXT } from "@/constants";
import { TargetShiftProps } from "@/types";

type TargetShiftForm = Pick<
    TargetShiftProps,
    "revenue" | "transfer" | "point" | "cash" | "description"
>;

export default function TargetShiftModal(props: TargetShiftProps) {
    const { id, revenue = 0, transfer = 0, point = 0, cash = 0, description = "" } = props;

    //** Stores */
    const { getModal } = useModalStore();

    //** Queries */
    const { isLoading, updateTargetShift } = useTargetShift();

    //** React hook form */
    const defaultValues = {
        revenue,
        transfer,
        point,
        cash,
        description,
    };

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TargetShiftForm>({ values: defaultValues });

    const watchedValues = useWatch({
        control,
        name: ["revenue", "transfer", "point"],
    });

    //** Functions */
    const onSubmit = async (data: TargetShiftForm) => {
        await updateTargetShift({
            id,
            params: data,
        });

        getModal({
            isOpen: false,
        });
    };

    //** Effects */
    useEffect(() => {
        const r = watchedValues[0];
        const t = watchedValues[1];
        const p = watchedValues[2];

        setValue("cash", r - t - p);
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
                    name="cash"
                    render={({ field }) => (
                        <NumberInput
                            className="col-span-2"
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

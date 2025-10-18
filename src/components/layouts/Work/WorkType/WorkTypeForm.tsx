import React from "react";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import { useWorkTypeStore, WorkTypeProps } from "@/stores/useWorkTypeStore";
import { useModalStore } from "@/stores/useModalStore";
import { Controller, useForm } from "react-hook-form";
import { TEXT } from "@/constants";

export default function WorkTypeForm() {
    //** Stores */
    const { getModal } = useModalStore();
    const { workTypeById, createWorkType, updateWorkType, resetWorkTypeById } = useWorkTypeStore();

    //** Functions */
    const handleCloseModal = () => {
        reset();
        resetWorkTypeById();
        getModal({
            isOpen: false,
        });
    };

    //** React hook form */
    const { control, handleSubmit, reset } = useForm<WorkTypeProps>({
        defaultValues: {
            name: workTypeById.name,
            description: workTypeById.description,
        },
    });

    const onSubmit = async (data: WorkTypeProps) => {
        if (workTypeById.id) {
            await updateWorkType(workTypeById.id, data);
        } else {
            await createWorkType(data);
        }

        handleCloseModal();
    };

    //** Variables */
    const WORK_TYPE_FORM = [
        {
            label: TEXT.WORK_TYPE_NAME,
            name: "name",
            component: Input,
            validate: {
                required: TEXT.IS_REQUIRED,
            },
        },
        {
            label: TEXT.DESCRIPTION,
            name: "description",
            component: Input,
            type: "textarea",
        },
    ];

    /** Render */
    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {WORK_TYPE_FORM.map(item => (
                <Controller
                    key={item.name}
                    control={control}
                    name={item.name}
                    rules={item.validate}
                    render={({ field, formState: { errors } }) => (
                        <item.component
                            label={item.label}
                            type={item.type || "input"}
                            {...field}
                            isInvalid={!!errors[item.name]}
                            errorMessage={<ErrorMessage errors={errors} name={item.name} />}
                        />
                    )}
                />
            ))}

            <div className="flex justify-end gap-2">
                <Button type="button" color="default" onPress={handleCloseModal}>
                    {TEXT.CANCEL}
                </Button>
                <Button type="submit">{TEXT.SUBMIT}</Button>
            </div>
        </form>
    );
}

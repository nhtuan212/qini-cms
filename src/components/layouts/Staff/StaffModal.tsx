"use client";

import React, { useEffect } from "react";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { TEXT } from "@/constants";
import { ModalActionProps } from "@/lib/types";

type FormValues = {
    name: string;
};

export default function StaffModal() {
    //** Stores */
    const { modal, getModal } = useModalStore();
    const { staffById, getStaff, createStaff, updateStaff } = useStaffStore();

    //** Spread syntax */
    const { action } = modal;

    //** React hook form */
    const defaultValues = {
        name: action === ModalActionProps.UPDATE ? staffById.name : "",
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        values: defaultValues,
        criteriaMode: "all",
    });

    const onSubmit = async (data: FormValues) => {
        switch (action) {
            case ModalActionProps.CREATE:
                return createStaff(data).then(() => {
                    handleCloseModal();
                });
            case ModalActionProps.UPDATE:
                return updateStaff({
                    id: staffById.id,
                    bodyParams: data,
                }).then(() => {
                    handleCloseModal();
                });
            default:
                break;
        }
    };

    //** Functions */
    const resetForm = () => {
        reset({
            name: "",
        });
    };

    const handleCloseModal = () => {
        getModal({
            isOpen: false,
        });
        resetForm();
        getStaff();
    };

    //** Effects */
    useEffect(() => {
        if (action === ModalActionProps.UPDATE) {
            setValue("name", staffById?.name);
        }
    }, [setValue, action, staffById]);

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
                startContent={<UserCircleIcon className="w-6" />}
                placeholder={TEXT.NAME}
                {...register("name", {
                    required: `${TEXT.NAME} ${TEXT.IS_REQUIRED}`,
                })}
                isInvalid={!!errors.name}
                errorMessage={<ErrorMessage errors={errors} name={"name"} />}
            />

            <div className="flex flex-row-reverse gap-2">
                <Button type="submit">{TEXT.SAVE}</Button>
                <Button
                    className="bg-white text-default-900 ring-1 ring-inset ring-gray-300"
                    onPress={handleCloseModal}
                >
                    {TEXT.CANCEL}
                </Button>
            </div>
        </form>
    );
}

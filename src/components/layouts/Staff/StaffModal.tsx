"use client";

import React, { useEffect } from "react";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import PasswordInput from "@/components/PasswordInput";
import { useForm } from "react-hook-form";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { TEXT } from "@/constants";
import { encryptPasswordRSA } from "@/utils";
import { ModalActionProps } from "@/lib/types";

type FormValues = {
    name: string;
    password: string;
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
        password: "",
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
        const result = {
            name: data.name,
            ...(data.password && { password: encryptPasswordRSA(data.password) }),
        };

        switch (action) {
            case ModalActionProps.CREATE:
                return createStaff(result).then(() => {
                    handleCloseModal();
                });
            case ModalActionProps.UPDATE:
                return updateStaff({
                    id: staffById.id,
                    bodyParams: result,
                }).then(() => {
                    handleCloseModal();
                });
            default:
                break;
        }
    };

    //** Functions */
    const handleCloseModal = () => {
        getModal({
            isOpen: false,
        });

        reset();
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
                label={TEXT.NAME}
                placeholder={TEXT.ENTER_NAME}
                {...register("name", {
                    required: `${TEXT.NAME} ${TEXT.IS_REQUIRED}`,
                })}
                isInvalid={!!errors.name}
                errorMessage={<ErrorMessage errors={errors} name={"name"} />}
            />

            <PasswordInput
                variant="bordered"
                {...register("password", {
                    required:
                        action === ModalActionProps.CREATE
                            ? `${TEXT.PASSWORD} ${TEXT.IS_REQUIRED}`
                            : false,
                })}
                isInvalid={!!errors.password}
                errorMessage={<ErrorMessage errors={errors} name={"password"} />}
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

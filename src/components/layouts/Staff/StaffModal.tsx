"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import { Controller, useForm } from "react-hook-form";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { StaffData, useStaffStore } from "@/stores/useStaffStore";
import { TEXT } from "@/constants/text";
import { ModalActionProps } from "@/lib/types";

type FormValues = {
    name: string;
};

export default function StaffModal() {
    //** Stores */
    const { modal, getModal } = useModalStore();
    const { staffById, getStaff, addStaff, editStaff } = useStaffStore();

    //** Spread syntax */
    const { action } = modal;

    //** States */
    const [error, setError] = useState("");

    //** React hook form */
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
        },
        criteriaMode: "all",
    });

    const onSubmit = async (data: FormValues) => {
        const staffData: StaffData = {
            name: data.name,
        };

        switch (action) {
            case ModalActionProps.CREATE:
                return addStaff({ staffData }).then(res => {
                    if (res.code !== 200) return setError(res.message);

                    handleCloseModal();
                });
            case ModalActionProps.UPDATE:
                return editStaff({
                    id: staffById.id,
                    staffData,
                }).then(res => {
                    if (res.code !== 200) return setError(res.message);

                    handleCloseModal();
                });
            default:
                break;
        }
    };

    //** Functions */
    const resetForm = () => {
        setError("");
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
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full">
                <Controller
                    name={"name"}
                    control={control}
                    rules={{ required: true }}
                    render={() => (
                        <>
                            <Input
                                className="w-full"
                                startContent={<UserCircleIcon className="w-6" />}
                                placeholder={TEXT.NAME}
                                {...register("name", {
                                    required: `${TEXT.NAME} ${TEXT.IS_REQUIRED}`,
                                })}
                                errorMessage={<ErrorMessage errors={errors} name={"name"} />}
                            />
                            {error && <p className="errorMessage">{error}</p>}
                        </>
                    )}
                />
            </div>

            <div className="flex flex-row-reverse gap-2">
                <Button type="submit">{TEXT.SAVE}</Button>
                <Button
                    className="bg-white text-default-900 ring-1 ring-inset ring-gray-300"
                    onClick={handleCloseModal}
                >
                    {TEXT.CANCEL}
                </Button>
            </div>
        </form>
    );
}
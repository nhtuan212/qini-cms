"use client";

import React, { useEffect } from "react";
import StaffConfigSalary from "./StaffConfigSalary";
import StaffConfigInformation from "./StaffConfigInformation";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { encryptPasswordRSA } from "@/utils";
import { ModalActionProps } from "@/lib/types";
import { TEXT } from "@/constants";

export type FormStaffProps = {
    name: string;
    salary: number;
    password?: string;
    salaryType: string;
    isTarget: boolean;
};

export default function StaffModal() {
    //** Stores */
    const { modal, getModal } = useModalStore();
    const { staffById, getStaff, createStaff, updateStaff } = useStaffStore();

    //** Spread syntax */
    const { action } = modal;

    //** React hook form */
    const defaultValues = {
        name: staffById.name || "",
        salary: staffById.salary || 0,
        salaryType: staffById.salaryType || "",
        isTarget: staffById.isTarget || false,
    };

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormStaffProps>({
        values: defaultValues,
        criteriaMode: "all",
    });

    const onSubmit = async (data: FormStaffProps) => {
        const result = {
            ...data,
            ...(data.password && {
                password: encryptPasswordRSA(data.password),
            }),
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
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 gap-4">
                <StaffConfigInformation control={control} errors={errors} />
                <StaffConfigSalary control={control} watch={watch} />
            </div>

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

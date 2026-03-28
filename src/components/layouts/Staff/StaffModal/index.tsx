"use client";

import React, { useEffect } from "react";
import StaffConfigSalary from "./StaffConfigSalary";
import StaffConfigInformation from "./StaffConfigInformation";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { useModalStore } from "@/stores/useModalStore";
import { useStaff } from "@/hooks";
import { encryptPasswordRSA } from "@/utils";
import { TEXT } from "@/constants";
import { ModalActionProps, StaffProps } from "@/types";

export type FormStaffProps = {
    name: string;
    salary: number;
    password?: string;
    salaryType: string;
    isTarget: boolean;
};

export default function StaffModal({ staff }: { staff?: StaffProps }) {
    //** Stores */
    const { modal, getModal } = useModalStore();

    //** Spread syntax */
    const { action } = modal;

    //** Queries */
    const { createStaff, updateStaff } = useStaff();

    //** React hook form */
    const defaultValues = {
        name: staff?.name || "",
        salary: staff?.salary || 0,
        salaryType: staff?.salaryType || "",
        isTarget: staff?.isTarget || false,
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
                    id: staff?.id,
                    params: result,
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
    };

    //** Effects */
    useEffect(() => {
        if (action === ModalActionProps.UPDATE) {
            setValue("name", staff?.name);
        }
    }, [setValue, action, staff]);

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

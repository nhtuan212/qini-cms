"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import { Controller, useForm } from "react-hook-form";
import { BanknotesIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { StaffData, useStaffStore } from "@/stores/useStaffStore";
import { MODAL } from "@/constants";
import { TEXT } from "@/constants/text";

type FormValues = {
    name: string;
    salary: string | number;
};

export default function AddStaff() {
    //** Stores */
    const { openModal, modalName, modalAction } = useModalStore();
    const { staffById, getStaff, addStaff, editStaff } = useStaffStore();

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
            salary: +data.salary,
        };

        if (modalAction === "add") {
            return addStaff({ staffData }).then(res => {
                if (res.code !== 200) return setError(res.message);

                handleCloseModal();
            });
        }

        return editStaff({
            id: staffById.id,
            staffData,
        }).then(res => {
            if (res.code === 404) return setError(res.message);

            handleCloseModal();
        });
    };

    //** Functions */
    const resetForm = () => {
        setError("");
        reset({
            name: "",
            salary: 0,
        });
    };

    const handleCloseModal = () => {
        openModal("");
        resetForm();
        getStaff();
    };

    //** Effects */
    useEffect(() => {
        if (modalAction === "edit") {
            setValue("name", staffById?.name);
            setValue("salary", new Intl.NumberFormat("vi-VN").format(staffById?.salary));
        }
    }, [setValue, modalAction, staffById]);

    return (
        <Modal isOpen={modalName === MODAL.ADD_STAFF} size="md" onOpenChange={handleCloseModal}>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>{TEXT.STAFF}</Modal.Header>

                <Modal.Body>
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
                                        errorMessage={
                                            <ErrorMessage errors={errors} name={"name"} />
                                        }
                                    />
                                    {error && <p className="errorMessage">{error}</p>}
                                </>
                            )}
                        />

                        <Controller
                            name={"salary"}
                            control={control}
                            rules={{ required: true }}
                            render={() => (
                                <>
                                    <Input
                                        className="w-full"
                                        startContent={<BanknotesIcon className="w-6" />}
                                        endContent={<span>vnđ</span>}
                                        placeholder={TEXT.SALARY}
                                        currencyInput
                                        {...register("salary", {
                                            required: `${TEXT.SALARY} ${TEXT.IS_REQUIRED}`,
                                            setValueAs: value => {
                                                if (typeof value === "string")
                                                    return value?.replace(/\.|,/g, "");
                                            },
                                        })}
                                        errorMessage={
                                            <ErrorMessage errors={errors} name={"salary"} />
                                        }
                                    />
                                    {error && <p className="errorMessage">{error}</p>}
                                </>
                            )}
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <div className="flex flex-row-reverse gap-2">
                        <Button type="submit">{TEXT.SAVE}</Button>
                        <Button
                            className="bg-white text-default-900 ring-1 ring-inset ring-gray-300"
                            onClick={handleCloseModal}
                        >
                            {TEXT.CANCEL}
                        </Button>
                    </div>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

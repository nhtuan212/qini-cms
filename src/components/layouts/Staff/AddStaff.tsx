"use client";

import React, { useEffect } from "react";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";
import { Controller, useForm } from "react-hook-form";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useModalStore } from "@/stores/useModalStore";
import { useStaffStore } from "@/stores/useStaffStore";
import { MODAL } from "@/constants";
import { TEXT } from "@/constants/text";
import { fetchData } from "@/utils/fetch";
import { URL } from "@/config/urls";
import { StaffProps } from "@/types/staffProps";
import { isEmpty } from "@/utils";

type FormValues = {
    name: string;
};

export default function AddStaff({ staffId }: { staffId: StaffProps }) {
    //** Stores */
    const { openModal, modalName } = useModalStore();
    const { getStaff } = useStaffStore();

    //** React hook form */
    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
        },
        criteriaMode: "all",
    });

    const onSubmit = async (data: FormValues) => {
        const endpoint = !isEmpty(staffId) ? `${URL.STAFF}/${staffId.id}` : URL.STAFF;
        const method = !isEmpty(staffId) ? "PUT" : "POST";

        return await fetchData({
            endpoint,
            options: {
                method,
                body: JSON.stringify({
                    name: data.name,
                }),
            },
        }).then(res => {
            if (res.code !== 200) {
                return setError("root.serverError", {
                    type: res.code,
                });
            }

            handleCloseModal();
            getStaff();
        });
    };

    //** Functions */
    const resetForm = () => {
        reset({
            name: "",
        });
    };

    const handleCloseModal = () => {
        openModal("");
        resetForm();
    };

    //** Effects */
    useEffect(() => {
        !isEmpty(staffId) && setValue("name", staffId?.name);
    }, [staffId, setValue]);

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
                                    {errors?.root?.serverError.type === 400 && (
                                        <p className="errorMessage">{TEXT.STAFF_IS_EXIST}</p>
                                    )}
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

import React from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useModalStore } from "@/stores/useModalStore";
import { Select, SelectItem } from "@nextui-org/react";
import {
    ClockIcon,
    CurrencyDollarIcon,
    PlusIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useProfileStore } from "@/stores/useProfileStore";
import { staffApi, timeSheet } from "@/config/apis";
import { TEXT } from "@/constants/text";

type FormValues = {
    staff: {
        name: string;
        checkIn: string;
        checkOut: string;
    }[];
};

export default function ReportAddNew() {
    //** Stores */
    const { profile } = useProfileStore();
    const { openModal, isModalOpen } = useModalStore();

    //** React hook form */
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            staff: [{ name: "", checkIn: "", checkOut: "" }],
        },
        mode: "onBlur",
    });
    const { fields, append, remove } = useFieldArray({
        name: "staff",
        control,
    });
    const onSubmit = (data: FormValues) => console.log(data);

    return (
        <Modal
            isOpen={isModalOpen}
            size="4xl"
            onOpenChange={() => openModal(false)}
        >
            <Modal.Header>{TEXT.ADD_REPORT}</Modal.Header>
            <Modal.Body>
                <div className="flex flex-column flex-wrap gap-4 my-4">
                    <div className="w-full flex justify-between items-center">
                        <p>
                            {TEXT.WORK_SHIFT}:{" "}
                            <b className="text-primary">{profile.username}</b>
                        </p>
                        <p>
                            {TEXT.DATE}: {new Date().toDateString()}
                        </p>
                    </div>

                    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((field, index) => {
                            return (
                                <div
                                    key={field.id}
                                    className="w-full flex justify-between items-center gap-3"
                                >
                                    <Controller
                                        name={`staff.${index}.name`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange } }) => (
                                            <Select
                                                className="w-full"
                                                startContent={
                                                    <UserCircleIcon className="w-6" />
                                                }
                                                label={TEXT.STAFF}
                                                onChange={onChange}
                                                errorMessage={
                                                    errors?.staff?.[index]
                                                        ?.name &&
                                                    "Name is required"
                                                }
                                            >
                                                {staffApi.map(item => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.value}
                                                    >
                                                        {item.value}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <Controller
                                        name={`staff.${index}.checkIn`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange } }) => (
                                            <Select
                                                className="w-full"
                                                startContent={
                                                    <ClockIcon className="w-6" />
                                                }
                                                label={TEXT.CHECK_IN}
                                                onChange={onChange}
                                                errorMessage={
                                                    errors?.staff?.[index]
                                                        ?.checkIn &&
                                                    "Check-in is required"
                                                }
                                            >
                                                {timeSheet.map(item => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.value}
                                                    >
                                                        {item.value}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <Controller
                                        name={`staff.${index}.checkOut`}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange } }) => (
                                            <Select
                                                className="w-full"
                                                startContent={
                                                    <ClockIcon className="w-6" />
                                                }
                                                label={TEXT.CHECK_OUT}
                                                onChange={onChange}
                                                errorMessage={
                                                    errors?.staff?.[index]
                                                        ?.checkOut &&
                                                    "Check-out is required"
                                                }
                                            >
                                                {timeSheet.map(item => (
                                                    <SelectItem
                                                        key={item.id}
                                                        value={item.value}
                                                    >
                                                        {item.value}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            );
                        })}
                        <Button className="mt-4" type="submit">
                            {TEXT.SAVE}
                        </Button>
                        <button
                            type="button"
                            onClick={() =>
                                append({ name: "", checkIn: "", checkOut: "" })
                            }
                        >
                            append
                        </button>
                    </form>

                    <div className="w-full flex justify-end">
                        <Button>
                            <PlusIcon className="w-5 mr-2" />
                            {TEXT.ADD_STAFF}
                        </Button>
                    </div>
                    <div className="w-full">
                        <Input
                            className="w-full"
                            startContent={
                                <CurrencyDollarIcon className="w-6" />
                            }
                            placeholder={TEXT.REVENUE}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex flex-row-reverse gap-2">
                    <Button onClick={() => openModal(false)}>
                        {TEXT.SAVE}
                    </Button>
                    <Button
                        className="bg-white text-default-900 ring-1 ring-inset ring-gray-300"
                        onClick={() => openModal(false)}
                    >
                        {TEXT.CANCEL}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

import React, { useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { useModalStore } from "@/stores/useModalStore";
import { useWorkTypeStore } from "@/stores/useWorkTypeStore";
import { useWorkAssignmentStore, WorkAssignmentProps } from "@/stores/useWorkAssignmentStore";
import { Controller, useForm } from "react-hook-form";
import { TEXT } from "@/constants";
import { formatDate, getDayName, isEmpty } from "@/utils";
import { Select, SelectItem } from "@/components/Select";
import { useStaffStore } from "@/stores/useStaffStore";

export default function WorkAssignmentForm({ date }: { date: Date }) {
    //** Stores */
    const { getModal } = useModalStore();
    const { workTypes, getWorkTypes } = useWorkTypeStore();
    const { staff, getStaff } = useStaffStore();
    const { createWorkAssignment } = useWorkAssignmentStore();

    //** Variables */
    const ASSIGNMENT_FORM = [
        {
            label: TEXT.WORK_TYPE_NAME,
            name: "workTypeId",
            field: "select",
            options: workTypes,
            validate: {
                required: TEXT.IS_REQUIRED,
            },
        },
        {
            label: TEXT.STAFF_NAME,
            name: "staffId",
            field: "select",
            options: staff,
            validate: {
                required: TEXT.IS_REQUIRED,
            },
        },
    ];

    //** React hook form */
    const { control, handleSubmit, reset } = useForm<WorkAssignmentProps>({
        defaultValues: {
            workTypeId: "",
            date: date,
        },
    });

    const onSubmit = async (data: WorkAssignmentProps) => {
        const result = {
            ...data,
            date: formatDate(date, "YYYY-MM-DD"),
        };

        await createWorkAssignment(result);

        handleCloseModal();
    };

    //** Functions */
    const handleCloseModal = () => {
        reset();
        getModal({
            isOpen: false,
        });
    };

    //** Effects */
    useEffect(() => {
        if (isEmpty(workTypes)) {
            getWorkTypes();
        }
    }, [getWorkTypes, workTypes]);

    useEffect(() => {
        if (isEmpty(staff)) {
            getStaff();
        }
    }, [getStaff, staff]);

    //** Render */
    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="text-sm font-medium">{`${getDayName(new Date(date))} - ${formatDate(new Date(date))}`}</div>
            {ASSIGNMENT_FORM.map(item => (
                <Controller
                    key={item.name}
                    control={control}
                    name={item.name}
                    rules={item.validate}
                    render={({ field, formState: { errors } }) =>
                        item.field === "select" ? (
                            <Select
                                label={item.label}
                                {...field}
                                isInvalid={!!errors[item.name]}
                                errorMessage={<ErrorMessage errors={errors} name={item.name} />}
                            >
                                {item.options.map(option => (
                                    <SelectItem key={option.id}>{option.name}</SelectItem>
                                ))}
                            </Select>
                        ) : (
                            <Input
                                label={item.label}
                                {...field}
                                isInvalid={!!errors[item.name]}
                                errorMessage={<ErrorMessage errors={errors} name={item.name} />}
                            />
                        )
                    }
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

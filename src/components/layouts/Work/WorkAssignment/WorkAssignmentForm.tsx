import React, { useEffect } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { Select, SelectItem } from "@/components/Select";
import { useModalStore } from "@/stores/useModalStore";
import { useWorkTypeStore } from "@/stores/useWorkTypeStore";
import { useWorkAssignmentStore, WorkAssignmentProps } from "@/stores/useWorkAssignmentStore";
import { useShift, useEmployee } from "@/hooks";
import { Controller, useForm } from "react-hook-form";
import { TEXT } from "@/constants";
import { formatDate, getDayName, isEmpty } from "@/utils";

export default function WorkAssignmentForm({
    date,
    assignment,
}: {
    date: Date;
    assignment?: WorkAssignmentProps;
}) {
    //** Stores */
    const { getModal } = useModalStore();
    const { workTypes, getWorkTypes } = useWorkTypeStore();
    const { createWorkAssignment, updateWorkAssignment } = useWorkAssignmentStore();

    //** Queries */
    const { shifts } = useShift();
    const { employees } = useEmployee();

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
            label: TEXT.WORK_SHIFT_SELECT,
            name: "shiftId",
            field: "select",
            options: shifts,
            validate: {
                required: TEXT.IS_REQUIRED,
            },
        },
        {
            label: TEXT.EMPLOYEE_NAME,
            name: "userId",
            field: "select",
            options: employees.map(employee => ({ ...employee, id: employee.userId })),
            validate: {
                required: TEXT.IS_REQUIRED,
            },
        },
    ];

    //** React hook form */
    const defaultValues = {
        workTypeId: assignment?.workTypeId || "",
        userId: assignment?.userId || "",
        shiftId: assignment?.shiftId || "",
        date: date,
    };

    const { control, handleSubmit, reset } = useForm<WorkAssignmentProps>({
        defaultValues,
    });

    const onSubmit = async (data: WorkAssignmentProps) => {
        const result = {
            ...data,
            date: formatDate(date, "YYYY-MM-DD"),
        };

        if (assignment?.id) {
            await updateWorkAssignment(assignment.id, result);
        } else {
            await createWorkAssignment(result);
        }

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
                                selectedKeys={[
                                    item.options.find(option => option.id === field.value)?.id,
                                ]}
                                onSelectionChange={value => field.onChange(value.currentKey)}
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

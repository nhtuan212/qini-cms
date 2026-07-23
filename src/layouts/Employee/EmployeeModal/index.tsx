"use client";

import { useEffect } from "react";
import EmployeeConfigSalary from "./EmployeeConfigSalary";
import EmployeeConfigInformation from "./EmployeeConfigInformation";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { useModalStore } from "@/stores/useModalStore";
import { useEmployee } from "@/hooks";
import { TEXT } from "@/constants";
import { EmployeeProps } from "@/types";

export type FormEmployeeProps = Pick<EmployeeProps, "name" | "salary" | "salaryType" | "isTarget">;

export default function EmployeeModal({ employee }: { employee?: EmployeeProps }) {
    //** Stores */
    const { getModal } = useModalStore();

    //** Queries */
    const { createEmployee, updateEmployee } = useEmployee();

    //** React hook form */
    const defaultValues = {
        name: employee?.name || "",
        salary: employee?.salary || 0,
        salaryType: employee?.salaryType || "HOURLY",
        isTarget: employee?.isTarget || false,
    };

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormEmployeeProps>({
        values: defaultValues,
        criteriaMode: "all",
    });

    const onSubmit = async (data: FormEmployeeProps) => {
        const result = {
            name: data.name,
            salary: data.salary,
            salaryType: data.salaryType,
            isTarget: data.isTarget,
        };

        if (employee) {
            return updateEmployee({
                id: employee.id,
                params: result,
            }).then(() => {
                handleCloseModal();
            });
        }

        return createEmployee({
            ...result,
            isActive: true,
        }).then(() => {
            handleCloseModal();
        });
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
        employee && setValue("name", employee.name);
    }, [setValue, employee]);

    //** Return */
    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid sm:grid-cols-2 gap-4">
                <EmployeeConfigInformation control={control} errors={errors} />
                <EmployeeConfigSalary control={control} watch={watch} />
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

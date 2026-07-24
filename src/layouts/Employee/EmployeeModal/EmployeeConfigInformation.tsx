import React from "react";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Card from "@/components/Card";
import { TEXT } from "@/constants";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormEmployeeProps } from ".";

interface EmployeeConfigInformationProps {
    control: Control<FormEmployeeProps>;
    errors: FieldErrors<FormEmployeeProps>;
}

export default function EmployeeConfigInformation({
    control,
    errors,
}: EmployeeConfigInformationProps) {
    return (
        <Card className="border p-3 space-y-4">
            <h3 className="text-gray-900 font-semibold">{TEXT.EMPLOYEE_INFORMATION}</h3>

            <Controller
                name="name"
                control={control}
                rules={{
                    required: `${TEXT.NAME} ${TEXT.IS_REQUIRED}`,
                }}
                render={({ field }) => (
                    <Input
                        label={TEXT.NAME}
                        placeholder={TEXT.ENTER_NAME}
                        {...field}
                        isInvalid={!!errors.name}
                        errorMessage={<ErrorMessage errors={errors} name={"name"} />}
                    />
                )}
            />
        </Card>
    );
}

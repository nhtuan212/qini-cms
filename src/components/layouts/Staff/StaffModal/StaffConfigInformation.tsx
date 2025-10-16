import React from "react";
import Input from "@/components/Input";
import ErrorMessage from "@/components/ErrorMessage";
import Card from "@/components/Card";
import PasswordInput from "@/components/PasswordInput";
import { TEXT } from "@/constants";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormStaffProps } from ".";

interface StaffConfigInformationProps {
    control: Control<FormStaffProps>;
    errors: FieldErrors<FormStaffProps>;
}

export default function StaffConfigInformation({ control, errors }: StaffConfigInformationProps) {
    return (
        <Card className="border p-3 space-y-4">
            <h3 className="text-gray-900 font-semibold">{TEXT.STAFF_INFORMATION}</h3>

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

            <Controller
                name="password"
                control={control}
                render={({ field }) => <PasswordInput variant="bordered" {...field} />}
            />
        </Card>
    );
}

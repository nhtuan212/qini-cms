import React from "react";
import Card from "@/components/Card";
import { Select, SelectItem } from "@/components/Select";
import ErrorMessage from "@/components/ErrorMessage";
import { NumberInput } from "@/components/Input";
import Switch from "@/components/Switch";
import { Control, Controller, UseFormWatch } from "react-hook-form";
import { SALARY_TYPE } from "@/apis";
import { TEXT } from "@/constants";
import { FormStaffProps } from ".";
import { SalaryTypeProps } from "@/lib/types";

interface StaffConfigSalaryProps {
    control: Control<FormStaffProps>;
    watch: UseFormWatch<FormStaffProps>;
}

export default function StaffConfigSalary({ control, watch }: StaffConfigSalaryProps) {
    //** Variables */
    const salaryTypeWatched = watch("salaryType");

    //** Render */
    return (
        <Card className="flex flex-col border p-3 space-y-4">
            <h3 className="text-gray-900 font-semibold">{TEXT.STAFF_SALARY}</h3>

            <Controller
                name="salaryType"
                control={control}
                rules={{
                    required: `${TEXT.SALARY_TYPE} ${TEXT.IS_REQUIRED}`,
                }}
                render={({ field, formState: { errors } }) => (
                    <Select
                        label={TEXT.SALARY_TYPE}
                        selectedKeys={[field.value as string]}
                        onSelectionChange={value => {
                            field.onChange(value.currentKey as string);
                        }}
                        isInvalid={!!errors.salaryType}
                        errorMessage={<ErrorMessage errors={errors} name={"salaryType"} />}
                    >
                        {SALARY_TYPE.map(salaryType => (
                            <SelectItem key={salaryType.value}>{salaryType.label}</SelectItem>
                        ))}
                    </Select>
                )}
            />

            <Controller
                name="salary"
                control={control}
                rules={{
                    validate: value => {
                        if (!value || value < 1) {
                            return `${TEXT.SALARY} ${TEXT.IS_REQUIRED_MIN}`;
                        }
                        return true;
                    },
                }}
                render={({ field, formState: { errors } }) => (
                    <NumberInput
                        label={
                            salaryTypeWatched === SalaryTypeProps.HOURLY
                                ? TEXT.SALARY_BY_HOUR
                                : TEXT.SALARY_BY_MONTH
                        }
                        value={field.value}
                        isInvalid={!!errors.salary}
                        errorMessage={<ErrorMessage errors={errors} name={"salary"} />}
                        onValueChange={field.onChange}
                    />
                )}
            />

            <Controller
                name="isTarget"
                control={control}
                render={({ field }) => (
                    <Switch
                        classNames={{ base: "h-full ml-auto" }}
                        isSelected={field.value}
                        onValueChange={field.onChange}
                    >
                        {TEXT.TARGET}
                    </Switch>
                )}
            />
        </Card>
    );
}

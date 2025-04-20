"use client";

import React from "react";
import {
    Input as InputNextUI,
    TimeInput as TimeInputHeroUI,
    NumberInput as NumberInputHeroUI,
    InputProps,
    Textarea as TextareaNextUI,
    TextAreaProps,
    TimeInputProps,
    NumberInputProps,
} from "@heroui/react";

const Input = React.forwardRef(
    ({ ...props }: InputProps | TextAreaProps, ref: React.Ref<HTMLInputElement>) => {
        const renderInput = () => {
            if (props.type === "textarea") {
                return (
                    <TextareaNextUI
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        variant="bordered"
                        radius="sm"
                        {...(props as TextAreaProps)}
                    />
                );
            }

            return (
                <InputNextUI
                    ref={ref}
                    size="sm"
                    variant="bordered"
                    radius="sm"
                    {...(props as InputProps)}
                />
            );
        };

        //** Render */
        return renderInput();
    },
);

export const TimeInput = React.forwardRef(
    ({ ...props }: TimeInputProps, ref: React.Ref<HTMLInputElement>) => {
        return (
            <TimeInputHeroUI
                label="Event Time"
                ref={ref}
                size="sm"
                variant={"bordered"}
                hourCycle={24}
                {...props}
            />
        );
    },
);

export const NumberInput = React.forwardRef(
    ({ ...props }: NumberInputProps, ref: React.Ref<HTMLInputElement>) => {
        return (
            <NumberInputHeroUI
                aria-label="Number input"
                ref={ref}
                size="sm"
                variant="bordered"
                hideStepper
                {...props}
            />
        );
    },
);

export default Input;

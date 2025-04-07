"use client";

import React from "react";
import {
    Input as InputNextUI,
    InputProps,
    Textarea as TextareaNextUI,
    TextAreaProps,
} from "@heroui/react";

const Input = React.forwardRef(
    (
        { variant = "bordered", radius = "sm", ...props }: InputProps | TextAreaProps,
        ref: React.Ref<HTMLInputElement>,
    ) => {
        const renderInput = () => {
            if (props.type === "textarea") {
                return (
                    <TextareaNextUI
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        variant={variant}
                        radius={radius}
                        {...(props as TextAreaProps)}
                    />
                );
            }

            return (
                <InputNextUI
                    ref={ref}
                    variant={variant}
                    radius={radius}
                    {...(props as InputProps)}
                />
            );
        };

        //** Render */
        return renderInput();
    },
);

export default Input;

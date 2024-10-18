"use client";

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "clsx";
import { NumericFormat, NumericFormatProps } from "react-number-format";

type InputProps = {
    label?: string;
    errorMessage?: React.ReactNode;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    inputRef?: any;
    isCurrency?: boolean;
    rows?: number;
    isInvalid?: boolean;
    isDisabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input = React.forwardRef(
    (
        {
            className,
            label,
            errorMessage,
            startContent,
            endContent,
            isInvalid = false,
            isDisabled = false,
            ...props
        }: InputProps,
        ref: React.Ref<HTMLInputElement> & React.Ref<HTMLTextAreaElement>,
    ) => {
        return (
            <div className={clsx("input", className, isDisabled && "opacity-50")}>
                {label && <label className="text-sm">{label}</label>}
                <div className="input-group">
                    {startContent && <span className="mr-2">{startContent}</span>}

                    <NumericFormat
                        getInputRef={ref}
                        // defaultValue={0}
                        decimalSeparator=","
                        thousandSeparator="."
                        disabled={isDisabled}
                        {...(props as NumericFormatProps)}
                    />

                    {endContent && <span className="ml-2">{endContent}</span>}
                </div>

                {isInvalid && <div className="errorMessage">{errorMessage}</div>}
            </div>
        );
    },
);

export default Input;

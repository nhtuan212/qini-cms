"use client";

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "clsx";
import CurrencyInput from "react-currency-input-field";

type InputProps = {
    label?: string;
    errorMessage?: React.ReactNode;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    inputRef?: any;
    currencyInput?: boolean;
    defaultValue?: number | string;
    rows?: number;
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
            type = "text",
            currencyInput = false,
            defaultValue = "",
            ...props
        }: InputProps,
        ref: React.Ref<HTMLInputElement> & React.Ref<HTMLTextAreaElement>,
    ) => {
        return (
            <div className={clsx("input", className, props.disabled && "opacity-50")}>
                {label && <label className="text-sm">{label}</label>}
                <div className="input-group">
                    {startContent && <span className="mr-2">{startContent}</span>}

                    {currencyInput ? (
                        <CurrencyInput
                            ref={ref}
                            defaultValue={defaultValue}
                            decimalSeparator=","
                            groupSeparator="."
                            {...(props as any)}
                        />
                    ) : type === "textarea" ? (
                        <textarea
                            ref={ref}
                            className="w-full resize-none focus:outline-none"
                            {...props}
                        />
                    ) : (
                        <input ref={ref} type={type} {...props} />
                    )}
                    {endContent && <span className="ml-2">{endContent}</span>}
                </div>

                {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            </div>
        );
    },
);

export default Input;

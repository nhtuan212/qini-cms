"use client";

import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "clsx";
import { NumericFormat } from "react-number-format";

type InputProps = {
    label?: string;
    errorMessage?: React.ReactNode;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    inputRef?: any;
    isCurrency?: boolean;
    rows?: number;
    isInvalid?: boolean;
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
            isCurrency = false,
            isInvalid = false,
            ...props
        }: InputProps,
        ref: React.Ref<HTMLInputElement> & React.Ref<HTMLTextAreaElement>,
    ) => {
        return (
            <div className={clsx("input", className, props.disabled && "opacity-50")}>
                {label && <label className="text-sm">{label}</label>}
                <div className="input-group">
                    {startContent && <span className="mr-2">{startContent}</span>}

                    {isCurrency ? (
                        <NumericFormat
                            getInputRef={ref}
                            defaultValue={0}
                            thousandSeparator={true}
                            // onValueChange={v => {
                            //     console.log(v.value);
                            // }}
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

                {isInvalid && <div className="errorMessage">{errorMessage}</div>}
            </div>
        );
    },
);

export default Input;

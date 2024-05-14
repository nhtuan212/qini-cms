"use client";

import React, { InputHTMLAttributes } from "react";
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
} & InputHTMLAttributes<HTMLInputElement>;

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
        ref: React.ForwardedRef<HTMLInputElement>,
    ) => {
        return (
            <div className={clsx("input", className)}>
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

// export default function Input({
//     className,
//     label,
//     startContent,
//     endContent,
//     type = "text",
//     onChange,
//     ...props
// }: InputProps) {
//     return (
//         <div className={clsx("input", className)}>
//             {label && <label className="text-sm">{label}</label>}
//             <div className="input-group">
//                 {startContent && <span className="mr-2">{startContent}</span>}
//                 <input type={type} onChange={onChange} {...props} />
//                 {endContent && <span className="ml-2">{endContent}</span>}
//             </div>
//         </div>
//     );
// }

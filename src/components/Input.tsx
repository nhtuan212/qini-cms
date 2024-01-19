"use client";

import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
}

export default function Input({
    className,
    label,
    startContent,
    endContent,
    type = "text",
    ...props
}: InputProps) {
    return (
        <div className={clsx("input", className)}>
            {label && <label className="text-sm">{label}</label>}
            <div className="input-group">
                {startContent && <span className="mr-2">{startContent}</span>}
                <input type={type} {...props} />
                {endContent && <span className="ml-2">{endContent}</span>}
            </div>
        </div>
    );
}

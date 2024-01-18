import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

export default function Button({
    className,
    children,
    type = "button",
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={clsx("button", className)} type={type} {...props}>
            {children}
        </button>
    );
}

"use client";

import React, { forwardRef } from "react";
import { Button as ButtonUI, ButtonProps } from "@nextui-org/react";

const Button = forwardRef(
    (
        {
            color = "primary",
            radius = "sm",
            variant = "solid",
            ...props
        }: ButtonProps,
        ref: any,
    ) => {
        return (
            <ButtonUI
                ref={ref}
                color={color}
                variant={variant}
                radius={radius}
                {...props}
            >
                {props.children}
            </ButtonUI>
        );
    },
);

// Button.displayName = "Button";
export default Button;

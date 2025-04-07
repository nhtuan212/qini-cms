"use client";

import React from "react";
import { Button as ButtonNextUI, ButtonProps } from "@heroui/react";

const Button = React.forwardRef(({ ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    return (
        <ButtonNextUI
            ref={ref}
            className={props.className}
            color={props.color || "primary"}
            radius={props.radius || "sm"}
            {...props}
        >
            {props.children}
        </ButtonNextUI>
    );
});

export default Button;

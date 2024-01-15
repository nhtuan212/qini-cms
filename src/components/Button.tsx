import React from "react";
import { Button as ButtonUI, ButtonProps } from "@nextui-org/react";

export default function Button({
    color = "primary",
    radius = "sm",
    ...props
}: ButtonProps) {
    return (
        <ButtonUI color={color} radius={radius} {...props}>
            {props.children}
        </ButtonUI>
    );
}

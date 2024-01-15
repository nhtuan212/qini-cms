import React from "react";
import { Button, ButtonProps } from "@nextui-org/react";

export default function ButtonComponent({
    color = "primary",
    radius = "sm",
    ...props
}: ButtonProps) {
    return (
        <Button color={color} radius={radius} {...props}>
            {props.children}
        </Button>
    );
}

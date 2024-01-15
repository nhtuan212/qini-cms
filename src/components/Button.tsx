import React from "react";
import { Button, ButtonProps } from "@nextui-org/react";

export default function ButtonComponent({
    radius = "sm",
    ...props
}: ButtonProps) {
    return (
        <Button radius={radius} {...props}>
            {props.children}
        </Button>
    );
}

"use client";

import React from "react";
import { Input, InputProps } from "@nextui-org/react";

export default function InputComponent({
    variant = "bordered",
    radius = "sm",
    ...props
}: InputProps) {
    return <Input variant={variant} radius={radius} {...props} />;
}

"use client";

import React from "react";
import { Input as InputUI, InputProps } from "@nextui-org/react";

export default function Input({
    variant = "bordered",
    radius = "sm",
    ...props
}: InputProps) {
    return <InputUI variant={variant} radius={radius} {...props} />;
}

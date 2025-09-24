"uae client";

import React from "react";
import { SwitchProps, Switch as SwitchNextUI } from "@heroui/react";

export default function Switch({ size = "sm", ...props }: SwitchProps) {
    return <SwitchNextUI size={size} {...props}></SwitchNextUI>;
}

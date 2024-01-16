"uae client";

import React from "react";
import { SwitchProps, Switch as SwitchUI } from "@nextui-org/react";

export default function Switch({ size = "md", ...props }: SwitchProps) {
    return <SwitchUI size={size} {...props}></SwitchUI>;
}

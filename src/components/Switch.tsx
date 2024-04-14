"uae client";

import React from "react";
import { SwitchProps, Switch as SwitchNextUI } from "@nextui-org/react";

export default function Switch({ size = "md", ...props }: SwitchProps) {
    return <SwitchNextUI size={size} {...props}></SwitchNextUI>;
}

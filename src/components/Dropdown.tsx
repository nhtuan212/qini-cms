"use client";

import React from "react";
import {
    Dropdown as DropdownNextUI,
    DropdownTrigger as DropdownTriggerNextUI,
    DropdownMenu as DropdownMenuNextUI,
    DropdownItem as DropdownItemNextUI,
    DropdownProps,
} from "@heroui/react";

const Dropdown = ({ ...props }: DropdownProps) => {
    return <DropdownNextUI>{props.children}</DropdownNextUI>;
};

const DropdownTrigger = DropdownTriggerNextUI;
const DropdownMenu = DropdownMenuNextUI;
const DropdownItem = DropdownItemNextUI;

export { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem };

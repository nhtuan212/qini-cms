"use client";

import React from "react";
import { Select as SelectNextUI, SelectItem as SelectItemNextUI, SelectProps } from "@heroui/react";

const Select = React.forwardRef(({ ...props }: SelectProps, ref: React.Ref<HTMLSelectElement>) => {
    return (
        <SelectNextUI ref={ref} size="sm" variant="bordered" radius="sm" {...props}>
            {props.children}
        </SelectNextUI>
    );
});

const SelectItem = SelectItemNextUI;

export { Select, SelectItem };

"use client";

import React from "react";
import {
    Select as SelectNextUI,
    SelectItem as SelectItemNextUI,
    SelectProps,
} from "@nextui-org/react";

const Select = React.forwardRef(({ ...props }: SelectProps, ref: React.Ref<HTMLSelectElement>) => {
    return (
        <SelectNextUI
            ref={ref}
            variant={props.variant || "bordered"}
            radius={props.radius || "sm"}
            {...props}
        >
            {props.children}
        </SelectNextUI>
    );
});

const SelectItem = SelectItemNextUI;

export { Select, SelectItem };

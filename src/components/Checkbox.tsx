"use client";

import React from "react";
import { Checkbox as CheckboxNextUI, CheckboxProps } from "@nextui-org/react";

const Checkbox = React.forwardRef(
    ({ ...props }: CheckboxProps, ref: React.Ref<HTMLInputElement>) => {
        return (
            <CheckboxNextUI
                ref={ref}
                size={props.size || "sm"}
                radius={props.radius || "sm"}
                {...props}
            >
                {props.children}
            </CheckboxNextUI>
        );
    },
);

export default Checkbox;

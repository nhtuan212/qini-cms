"use client";

import React from "react";
import { Button as ButtonNextUI, ButtonProps } from "@heroui/react";
import { useDebounce } from "@/hooks";

const Button = React.forwardRef(({ ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    //** Functions */
    const debouncedOnPress = useDebounce(props.onPress ?? (() => {}));

    //** Render */
    return (
        <ButtonNextUI
            ref={ref}
            color={props.color || "primary"}
            radius={props.radius || "sm"}
            {...props}
            onPress={debouncedOnPress}
        >
            {props.children}
        </ButtonNextUI>
    );
});

export default Button;

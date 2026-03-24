"use client";

import React, { useRef } from "react";
import { Button as ButtonNextUI, ButtonProps } from "@heroui/react";
import { useDebounce } from "@/hooks/useDebounce";

const Button = React.forwardRef(({ ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    //** States */
    const isSubmitting = useRef(false);

    //** Functions */
    const handleClick = useDebounce(async () => {
        if (typeof props.onPress !== "function") return;

        isSubmitting.current = true;

        await Promise.resolve(props.onPress({} as any)).finally(() => {
            isSubmitting.current = false;
        });
    });

    //** Render */
    return (
        <ButtonNextUI
            ref={ref}
            className={props.className}
            color={props.color || "primary"}
            radius={props.radius || "sm"}
            {...props}
            onPress={handleClick}
        >
            {props.children}
        </ButtonNextUI>
    );
});

export default Button;

"use client";

import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { InputProps } from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants";

const PasswordInput = React.forwardRef(
    ({ ...props }: InputProps, ref: React.Ref<HTMLInputElement>) => {
        //** States */
        const [isShowPassword, setIsShowPassword] = useState(false);

        //** Render */
        return (
            <Input
                ref={ref}
                label={TEXT.PASSWORD}
                size="md"
                type={isShowPassword ? "text" : "password"}
                endContent={
                    <Button
                        isIconOnly
                        variant="light"
                        className="h-8"
                        onPress={() => {
                            setIsShowPassword(!isShowPassword);
                        }}
                    >
                        {isShowPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                            <EyeIcon className="w-5 h-5" />
                        )}
                    </Button>
                }
                placeholder={TEXT.ENTER_PASSWORD}
                {...props}
            />
        );
    },
);

export default PasswordInput;

"use client";

import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { InputProps } from "@heroui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { TEXT } from "@/constants";

export default function PasswordInput({ ...props }: InputProps) {
    //** States */
    const [isShowPassword, setIsShowPassword] = useState(false);

    //** Render */
    return (
        <Input
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
}

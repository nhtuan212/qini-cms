"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "../Icons/Logo";
import InputComponent from "../Input";
import ButtonComponent from "../Button";
import { TEXT } from "@/constants/text";
import { EyeSlashFilledIcon } from "../Icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../Icons/EyeFilledIcon";

export default function Login() {
    //** States */
    const [isVisible, setIsVisible] = useState<boolean>(false);

    //** Functions */
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center p-6">
            <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm">
                <Link href={""}>
                    <Logo
                        width="64"
                        height="58"
                        className="w-[3rem] h-[3rem]"
                    />
                </Link>

                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {TEXT.LOGIN_YOUR_ACCOUNT}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                    <InputComponent
                        className="pb-5"
                        label={TEXT.USERNAME}
                        labelPlacement="outside"
                        placeholder={`${TEXT.ENTER_USERNAME}...`}
                        isRequired
                    />
                    <InputComponent
                        label={TEXT.PASSWORD}
                        labelPlacement="outside"
                        placeholder={`${TEXT.ENTER_PASSWORD}...`}
                        endContent={
                            <button
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                            >
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        isRequired
                    />
                    <div className="text-right text-sm">
                        <Link
                            href="#"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            {TEXT.FORGOT_PASSWORD}
                        </Link>
                    </div>

                    <ButtonComponent fullWidth color="primary">
                        {TEXT.LOGIN}
                    </ButtonComponent>
                </form>
            </div>
        </div>
    );
}

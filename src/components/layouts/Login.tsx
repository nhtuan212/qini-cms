"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "../Icons/Logo";
import Input from "../Input";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { EyeSlashFilledIcon } from "../Icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../Icons/EyeFilledIcon";
import { ROUTE } from "@/config/routes";
import { TEXT } from "@/constants/text";

export default function Login() {
    //** Variables */
    const router = useRouter();
    const searchParams = useSearchParams();

    //** States */
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [errorLogin, setErrorLogin] = useState<string>("");

    //** Functions */
    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const username = data.get("username");
        const password = data.get("password");

        const login = await signIn("credentials", {
            username,
            password,
            redirect: false,
            callbackUrl: searchParams.get("callbackUrl") || ROUTE.HOME,
        });

        if (!login?.ok) {
            const { message } = JSON.parse(login?.error as string);
            return setErrorLogin(message);
        }

        setErrorLogin("");
        router.push(searchParams.get("callbackUrl") || ROUTE.HOME);
        router.refresh();
    };

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
                <form onSubmit={onSubmit}>
                    <Input
                        className="pb-5"
                        label={TEXT.USERNAME}
                        name={"username"}
                        labelPlacement="outside"
                        placeholder={`${TEXT.ENTER_USERNAME}...`}
                        isRequired
                    />
                    <Input
                        label={TEXT.PASSWORD}
                        name={"password"}
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

                    {errorLogin && (
                        <p className="mt-3 font-semibold text-sm text-right text-error">
                            {errorLogin}
                        </p>
                    )}

                    <div className="text-right text-sm py-5">
                        <Link
                            href="#"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            {TEXT.FORGOT_PASSWORD}
                        </Link>
                    </div>

                    <Button fullWidth type="submit">
                        {TEXT.LOGIN}
                    </Button>
                </form>
            </div>
        </div>
    );
}

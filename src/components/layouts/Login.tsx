"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "../Icons/Logo";
import Input from "../Input";
import Button from "../Button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { signIn } from "next-auth/react";
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
                <Link href={ROUTE.HOME}>
                    <Logo width="64" height="58" className="w-[3rem] h-[3rem]" />
                </Link>

                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {TEXT.LOGIN_YOUR_ACCOUNT}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                    <Input
                        className="input-group:text-indigo-600 mt-2"
                        label={TEXT.USERNAME}
                        name={"username"}
                        placeholder={`${TEXT.ENTER_USERNAME}...`}
                        required
                    />
                    <Input
                        label={TEXT.PASSWORD}
                        name={"password"}
                        placeholder={`${TEXT.ENTER_PASSWORD}...`}
                        endContent={
                            <Button
                                className="p-0 h-auto bg-transparent focus:outline-none"
                                onClick={toggleVisibility}
                            >
                                {isVisible ? (
                                    <EyeSlashIcon className="w-6 text-primary pointer-events-none" />
                                ) : (
                                    <EyeIcon className="w-6 text-primary pointer-events-none" />
                                )}
                            </Button>
                        }
                        type={isVisible ? "text" : "password"}
                        required
                    />

                    {errorLogin && (
                        <p className="mt-3 font-semibold text-sm text-right text-error">
                            {errorLogin}
                        </p>
                    )}

                    <div className="text-right text-sm">
                        <Link
                            href="#"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                            {TEXT.FORGOT_PASSWORD}
                        </Link>
                    </div>

                    <Button className="w-full bg-primary text-white" type="submit">
                        {TEXT.LOGIN}
                    </Button>
                </form>
            </div>
        </div>
    );
}

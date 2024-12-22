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

        return await signIn("credentials", {
            username,
            password,
            redirect: false,
        }).then(res => {
            if (res?.code) {
                return setErrorLogin(res?.code as string);
            }

            setErrorLogin("");

            router.push(searchParams.get("callbackUrl") || ROUTE.HOME);
            router.refresh();
        });
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
                                onPress={toggleVisibility}
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

                    <Button className="w-full bg-primary text-white" type="submit">
                        {TEXT.LOGIN}
                    </Button>
                </form>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Logo from "../Icons/Logo";
import Button from "../Button";
import PasswordInput from "../PasswordInput";
import { fetchData } from "@/hooks";
import { ROUTE, STATUS_CODE, TEXT, URL } from "@/constants";

const MIN_PASSWORD_LENGTH = 6;

export default function SetPassword() {
    //** Variables */
    const router = useRouter();
    const { data: session } = useSession();

    const createPasswordToken = session?.user?.createPasswordToken;
    const username = session?.user?.username;

    //** States */
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //** Functions */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            return setError(TEXT.PASSWORD_MIN_LENGTH);
        }

        if (newPassword !== confirmPassword) {
            return setError(TEXT.PASSWORD_NOT_MATCH);
        }

        if (!createPasswordToken) {
            // Không có token (session hết hạn) → quay về login.
            return signOut({ callbackUrl: ROUTE.LOGIN });
        }

        try {
            setIsLoading(true);

            // Tạo mật khẩu bằng token cấp lúc first-login (Bearer riêng, không phải accessToken).
            const res = await fetchData({
                endpoint: URL.LOGIN_CREATE_PASSWORD,
                options: {
                    method: "POST",
                    headers: { Authorization: `Bearer ${createPasswordToken}` },
                    body: JSON.stringify({ newPassword }),
                },
            });

            const code = Number(res?.status ?? res?.code);
            const isError =
                code >= STATUS_CODE.BAD_REQUEST ||
                (!!res?.code && ![STATUS_CODE.OK, STATUS_CODE.CREATED].includes(res.code));

            if (isError) {
                return setError(res?.message || TEXT.SET_PASSWORD_FAILED);
            }

            const loginRes = await signIn("credentials", {
                username,
                password: newPassword,
                redirect: false,
            });

            if (loginRes?.code) {
                return setError(loginRes.code as string);
            }

            router.push(ROUTE.TARGET);
            router.refresh();
        } catch {
            setError(TEXT.SET_PASSWORD_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    //** Render */
    return (
        <div className="flex min-h-screen flex-1 flex-col justify-center p-6">
            <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm">
                <Logo width="64" height="58" className="w-[3rem] h-[3rem]" />

                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {TEXT.SET_PASSWORD_TITLE}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">{TEXT.SET_PASSWORD_DESC}</p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <PasswordInput
                        label={TEXT.ENTER_NEW_PASSWORD}
                        placeholder={TEXT.ENTER_NEW_PASSWORD}
                        value={newPassword}
                        isDisabled={isLoading}
                        onValueChange={value => {
                            setError("");
                            setNewPassword(value);
                        }}
                    />

                    <PasswordInput
                        label={TEXT.CONFIRM_PASSWORD}
                        placeholder={TEXT.ENTER_CONFIRM_PASSWORD}
                        value={confirmPassword}
                        isInvalid={!!error}
                        errorMessage={error}
                        isDisabled={isLoading}
                        onValueChange={value => {
                            setError("");
                            setConfirmPassword(value);
                        }}
                    />

                    <Button
                        className="w-full bg-primary text-white"
                        type="submit"
                        isLoading={isLoading}
                    >
                        {TEXT.SUBMIT}
                    </Button>
                </form>
            </div>
        </div>
    );
}

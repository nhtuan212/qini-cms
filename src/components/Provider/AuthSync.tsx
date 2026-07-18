"use client";

import { useSession } from "next-auth/react";
import { setAccessToken } from "@/auth/accessToken";

export default function AuthSync() {
    const { data } = useSession();

    setAccessToken(data?.user?.accessToken);

    return null;
}

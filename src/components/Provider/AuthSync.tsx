"use client";

import { useSession } from "next-auth/react";
import { setAccessToken } from "@/auth/accessToken";

/**
 * Đồng bộ accessToken từ NextAuth session vào cache module để `fetchData` (hàm
 * thường, ngoài React) đính kèm `Authorization: Bearer`. Gán ngay trong lúc
 * render (không dùng effect) để token có mặt trước khi các query con chạy.
 */
export default function AuthSync() {
    const { data } = useSession();

    setAccessToken(data?.user?.accessToken);

    return null;
}

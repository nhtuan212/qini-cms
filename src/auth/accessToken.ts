/**
 * Module-level cache của accessToken hiện tại để `fetchData` (hàm thường, ngoài
 * React) có thể đính kèm `Authorization: Bearer`. Được `AuthSync` đồng bộ từ
 * NextAuth session ở phía client. Server-side luôn là undefined (chỉ /login chạy
 * server-side và không cần token).
 */
let accessToken: string | undefined;

export const setAccessToken = (token?: string) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

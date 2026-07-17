import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { fetchData } from "@/hooks";
import { STATUS_CODE, TEXT, URL } from "@/constants";

class InvalidLogin401 extends CredentialsSignin {
    code = TEXT.USERNAME_PASSWORD_INVALID;
}

export const authCredentials = [
    Credentials({
        credentials: {
            username: {
                label: "Username",
                type: "text",
                placeholder: "admin",
            },
            password: { label: "Password", type: "password" },
        },

        authorize: async credentials => {
            return await fetchData({
                endpoint: URL.LOGIN,
                options: {
                    method: "POST",
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    }),
                },
            }).then(res => {
                switch (res.status) {
                    case STATUS_CODE.UNAUTHORIZED:
                        throw new InvalidLogin401();
                    default:
                        break;
                }

                // Lần đầu đăng nhập: BE trả { isFirstLogin, createPasswordToken }
                // (chưa có accessToken). Trả về session "pending" mang theo token
                // + username để trang set-password tạo mật khẩu rồi đăng nhập lại.
                // Trường hợp thường: res.data có { accessToken, role, ...user }.
                return { ...res.data, username: credentials?.username };
            });
        },
    }),
];

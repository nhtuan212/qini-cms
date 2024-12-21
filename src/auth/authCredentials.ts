import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { URL } from "@/config/urls";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE } from "@/constants";
import { TEXT } from "@/constants/text";

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

        async authorize(credentials) {
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

                return res.data;
            });
        },
    }),
];

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
                if (res.status === STATUS_CODE.UNAUTHORIZED || !res.data) {
                    throw new InvalidLogin401();
                }

                return { ...res.data, username: credentials?.username };
            });
        },
    }),
];

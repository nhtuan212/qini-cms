import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { URL } from "@/config/urls";
import { ROUTE } from "@/config/routes";
import { fetchData } from "@/utils/fetch";

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        // Credentials
        CredentialsProvider({
            //** UI for .../api/auth/signin */

            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.

            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "admin",
                },
                password: { label: "Password", type: "password" },
            },

            //** UI for .../api/auth/signin */

            async authorize(credentials) {
                // // Example implementation:
                // const user = {
                //     id: "1",
                //     lastName: "Nguyen",
                //     firstName: "Hoang Tuan",
                //     email: "nhtuan212@gmail.com",
                // };

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
                    const { code, message, data } = res;

                    if (code === 200) {
                        return {
                            id: data?.id,
                            username: data?.username,
                            email: data?.email,
                            role: data?.role,
                        };
                    }

                    throw new Error(JSON.stringify({ code, message }));
                });
            },
        }),
    ],

    // debug: process.env.NODE_ENV !== "production",
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            return { ...token, ...user };
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user = token;

            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: ROUTE.LOGIN,
    },
};

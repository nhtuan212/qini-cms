import NextAuth, { DefaultSession, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { authCredentials } from "./authCredentials";

declare module "next-auth" {
    interface User {
        role?: string;
        accessToken?: string;
        isFirstLogin?: boolean;
        createPasswordToken?: string;
        username?: string;
        userId?: string;
        isTarget?: boolean;
    }
    interface Session {
        user: {
            role?: string;
            accessToken?: string;
            isFirstLogin?: boolean;
            createPasswordToken?: string;
            username?: string;
            userId?: string;
            isTarget?: boolean;
        } & DefaultSession["user"];
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    providers: [...authCredentials],
    debug: process.env.NODE_ENV !== "production",

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return { ...token, ...user };
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user = token;
            return session;
        },
    },
});

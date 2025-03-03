import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { authCredentials } from "./authCredentials";

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

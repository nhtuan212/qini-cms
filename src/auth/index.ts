import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { authCredentials } from "./credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [...authCredentials],

    session: { strategy: "jwt" },
    debug: process.env.NODE_ENV === "development",

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

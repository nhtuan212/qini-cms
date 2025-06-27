import { auth } from "./auth";

export default auth(req => {
    if (
        !req.auth &&
        req.nextUrl.pathname !== "/login" &&
        req.nextUrl.pathname !== "/user/set-password"
    ) {
        // Redirect to login page with callback URL
        const newUrl = new URL("/login", req.nextUrl.origin);
        newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

        return Response.redirect(newUrl);
    }
    if (req.auth) {
        switch (req.nextUrl.pathname) {
            case "/":
            case "/login":
                return Response.redirect(new URL("/target", req.url));
            default:
                break;
        }
    }

    //** Check permission role */
    if (req.nextUrl.pathname.startsWith("/salary") && req.auth?.user?.role !== "ADMIN") {
        return Response.redirect(new URL("/login", req.url));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

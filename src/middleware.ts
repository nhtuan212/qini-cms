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
                return Response.redirect(new URL("/bao-cao", req.url));
            default:
                break;
        }
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

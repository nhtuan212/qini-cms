import { auth } from "./auth";
import { ROLE, ROUTE } from "./constants";

// Define route permissions based on menu configuration
const ROUTE_PERMISSIONS = {
    [ROUTE.EMPLOYEE]: [ROLE.ADMIN, ROLE.MANAGER],
    [ROUTE.SALARY]: [ROLE.ADMIN],
};

const hasRequiredRole = (userRole: string | undefined, requiredRoles: string[]): boolean => {
    if (!requiredRoles.length) return true;
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
};

export default auth(req => {
    const { pathname } = req.nextUrl;
    const user = req.auth?.user;
    const isPendingFirstLogin = !!user?.isFirstLogin;

    if (!req.auth) {
        // Handle back to login page
        if (pathname === ROUTE.LOGIN) return;

        const newUrl = new URL(ROUTE.LOGIN, req.nextUrl.origin);
        newUrl.searchParams.set("callbackUrl", pathname);

        return Response.redirect(newUrl);
    }

    if (isPendingFirstLogin) {
        if (pathname !== ROUTE.SET_PASSWORD) {
            return Response.redirect(new URL(ROUTE.SET_PASSWORD, req.url));
        }

        return;
    }

    switch (pathname) {
        case "/":
        case ROUTE.LOGIN:
        case ROUTE.SET_PASSWORD:
            return Response.redirect(new URL(ROUTE.TARGET, req.url));
        // case ROUTE.TARGET:
        //     if (user?.role === ROLE.STAFF) {
        //         return Response.redirect(new URL(ROUTE.EMPLOYEE, req.url));
        //     }
        //     break;
        default:
            break;
    }

    // Check permission role for protected routes
    const requiredRoles = ROUTE_PERMISSIONS[pathname as keyof typeof ROUTE_PERMISSIONS];

    if (requiredRoles && !hasRequiredRole(user?.role, requiredRoles)) {
        return Response.redirect(new URL("/not-found", req.url));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

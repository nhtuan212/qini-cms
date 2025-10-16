import { auth } from "./auth";
import { ROLE, ROUTE } from "./constants";

// Define route permissions based on menu configuration
const ROUTE_PERMISSIONS = {
    [ROUTE.SALARY]: [ROLE.ADMIN],
};

// Helper function to check if user has required role for a route
const hasRequiredRole = (userRole: string | undefined, requiredRoles: string[]): boolean => {
    if (!userRole || !requiredRoles.length) return true;
    return requiredRoles.includes(userRole);
};

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
            case "/target":
                // Redirect to staff page for STAFF role
                if (req.auth.user?.role === ROLE.STAFF) {
                    return Response.redirect(new URL("/staff", req.url));
                }
                break;
            default:
                break;
        }
    }

    // Check permission role for protected routes
    const currentPath = req.nextUrl.pathname;
    const requiredRoles = ROUTE_PERMISSIONS[currentPath as keyof typeof ROUTE_PERMISSIONS];

    if (requiredRoles && !hasRequiredRole(req.auth?.user?.role, requiredRoles)) {
        return Response.redirect(new URL("/not-found", req.url));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { auth } from "./auth";
import { ROLE, ROUTE } from "./constants";

// Define route permissions based on menu configuration
const ROUTE_PERMISSIONS = {
    [ROUTE.SALARY]: [ROLE.ADMIN],
    [ROUTE.WORK]: [ROLE.ADMIN],
};

// Helper function to check if user has required role for a route
const hasRequiredRole = (userRole: string | undefined, requiredRoles: string[]): boolean => {
    if (!userRole || !requiredRoles.length) return true;
    return requiredRoles.includes(userRole);
};

export default auth(req => {
    const { pathname } = req.nextUrl;
    const user = req.auth?.user;
    // Lần đầu đăng nhập: session "pending" (có createPasswordToken, chưa accessToken).
    const isPendingFirstLogin = !!user?.isFirstLogin;

    // Chưa đăng nhập
    if (!req.auth) {
        if (pathname === ROUTE.LOGIN) return;

        // Trang set-password cần session pending; nếu chưa đăng nhập → về login.
        const newUrl = new URL(ROUTE.LOGIN, req.nextUrl.origin);
        newUrl.searchParams.set("callbackUrl", pathname);

        return Response.redirect(newUrl);
    }

    // Đã đăng nhập nhưng chưa tạo mật khẩu → ép về set-password, chặn mọi route khác.
    if (isPendingFirstLogin) {
        if (pathname !== ROUTE.SET_PASSWORD) {
            return Response.redirect(new URL(ROUTE.SET_PASSWORD, req.url));
        }

        return;
    }

    // Đã đăng nhập bình thường
    switch (pathname) {
        case "/":
        case ROUTE.LOGIN:
        case ROUTE.SET_PASSWORD:
            // Đã có mật khẩu → không ở lại login/set-password nữa.
            return Response.redirect(new URL(ROUTE.TARGET, req.url));
        case ROUTE.TARGET:
            // Redirect to staff page for STAFF role
            if (user?.role === ROLE.STAFF) {
                return Response.redirect(new URL(ROUTE.STAFF, req.url));
            }
            break;
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

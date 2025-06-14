import { TEXT } from "./text";

export { TEXT };

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const RSA_PUBLIC_KEY = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY || "";

export const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    INVALID: 409,
};

export const ROLE = {
    ADMIN: "ADMIN",
    USER: "USER",
    REPORT: "REPORT",
};

export const STAFF = {
    STAFF: "STAFF",
    MANAGER: "MANAGER",
};

export const URL = {
    HOME: "/",
    LOGIN: "/login",
    TARGET: "/target",
    TARGET_STAFF: "/target-staff",
    USER: "/user",
    STAFF: "/staff",
    SHIFT: "/shift",
    TIME_SHEET: "/time-sheet",
};

export const ROUTE = {
    HOME: "/",
    LOGIN: "/login",
    TARGET: "/target",
    TIME_SHEET: "/time-sheet",
    STAFF: "/staff",
};

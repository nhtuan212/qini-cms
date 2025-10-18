import { TEXT } from "./text";

export { TEXT };

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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
    MANAGER: "MANAGER",
    REPORT: "REPORT",
    STAFF: "STAFF",
};

export const STAFF = {
    STAFF: "STAFF",
    MANAGER: "MANAGER",
};

export const URL = {
    HOME: "/",
    LOGIN: "/login",
    TARGET: "/target",
    TARGET_SHIFT: "/target-shift",
    TIME_SHEET: "/time-sheet",
    USER: "/user",
    STAFF: "/staff",
    SHIFT: "/shift",
    SALARY: "/salary",
    INVOICE: "/invoice",
    WORK_TYPE: "/work-type",
};

export const ROUTE = {
    HOME: "/",
    LOGIN: "/login",
    TARGET: "/target",
    WORK: "/work",
    TARGET_SHIFT: "/target-shift",
    TIME_SHEET: "/time-sheet",
    STAFF: "/staff",
    SALARY: "/salary",
};

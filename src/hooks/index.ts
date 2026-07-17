import { BASE_URL, STATUS_CODE } from "@/constants";
import { getAccessToken } from "@/auth/accessToken";

// Token hết hạn/không hợp lệ → đăng xuất về trang login. Chỉ chạy ở browser,
// khi đang có token, và không phải các endpoint đăng nhập (tránh việc nhập sai
// mật khẩu ở màn login lại kích hoạt signOut).
const handleUnauthorized = async () => {
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/login" });
};

export const fetchData = async ({
    endpoint,
    options,
}: {
    endpoint: string | URL;
    options?: RequestInit;
}) => {
    const url = `${BASE_URL}${endpoint}`;
    const token = getAccessToken();
    const { headers: optionHeaders, ...restOptions } = options || {};

    const isBrowser = typeof window !== "undefined";
    const isAuthEndpoint = String(endpoint).includes("/login");
    const shouldHandle401 = isBrowser && !isAuthEndpoint && !!token;

    return await fetch(url, {
        ...restOptions,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...optionHeaders,
        },
    })
        .then(async res => {
            if (shouldHandle401 && res.status === STATUS_CODE.UNAUTHORIZED) {
                await handleUnauthorized();
            }

            return res.json();
        })
        .then(body => {
            // BE có thể trả HTTP 200 nhưng bọc mã lỗi trong body ({ status/code: 401 }).
            if (
                shouldHandle401 &&
                (body?.status === STATUS_CODE.UNAUTHORIZED ||
                    body?.code === STATUS_CODE.UNAUTHORIZED)
            ) {
                handleUnauthorized();
            }

            return body;
        })
        .catch(() => {
            throw new Error("Failed to fetch data");
        });
};

export * from "./queries/useSalary";
export * from "./queries/useShift";
export * from "./queries/useStaff";
export * from "./queries/useTarget";
export * from "./queries/useTargetShift";
export * from "./queries/useTimeSheet";
export * from "./queries/useInvoice";
export * from "./useDebounce";

import { BASE_URL } from "@/constants";

export const fetchData = async ({
    endpoint,
    options,
}: {
    endpoint: string | URL;
    options?: RequestInit;
}) => {
    const url = `${BASE_URL}${endpoint}`;

    return await fetch(url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        ...options,
    })
        .then(res => res.json())
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

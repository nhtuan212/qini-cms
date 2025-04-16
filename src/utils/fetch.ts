import { BASE_URL } from "@/constants";

export const fetchData = async ({
    endpoint,
    options,
}: {
    endpoint: string | URL;
    options?: RequestInit;
}): Promise<any> => {
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

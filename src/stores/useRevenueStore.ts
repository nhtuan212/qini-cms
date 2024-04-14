import { URL } from "@/config/urls";
import { fetchData } from "@/utils/fetch";
import { create } from "zustand";

type RevenueState = {
    revenue: [];
};

type RevenueAction = {
    getRevenue: () => void;
    deleteRevenue: (id: string) => Promise<void>;
};

const initialState: RevenueState = {
    revenue: [],
};

export const useRevenueStore = create<RevenueState & RevenueAction>()(set => ({
    ...initialState,

    // Actions
    getRevenue: async () => {
        return await fetchData({
            endpoint: URL.REVENUE,
        }).then(res => {
            if (res?.code === 200) {
                return set({ revenue: res.data });
            }
            return set({
                revenue: res?.message,
            });
        });
    },

    deleteRevenue: async (id: string) => {
        return await fetchData({
            endpoint: URL.REVENUE,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => {
            if (res?.code === 200) {
                return res.data;
            }
            return set({
                revenue: res?.message,
            });
        });
    },
}));

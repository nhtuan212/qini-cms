import { URL } from "@/config/urls";
import { fetchData } from "@/utils/fetch";
import { create } from "zustand";

type ReportState = {
    report: [];
};

type ReportAction = {
    getReport: () => void;
    deleteReport: (id: string) => Promise<void>;
};

const initialState: ReportState = {
    report: [],
};

export const useReportsStore = create<ReportState & ReportAction>()(set => ({
    ...initialState,

    // Actions
    getReport: async () => {
        return await fetchData({
            endpoint: URL.REPORT,
        }).then(res => {
            if (res?.code === 200) {
                return set({ report: res.data });
            }
            return set({
                report: res?.message,
            });
        });
    },

    deleteReport: async (id: string) => {
        return await fetchData({
            endpoint: URL.REPORT,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => {
            if (res?.code === 200) {
                return res.data;
            }
            return set({
                report: res?.message,
            });
        });
    },
}));

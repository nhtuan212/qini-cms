import { URL } from "@/config/urls";
import { fetchData } from "@/utils/fetch";
import { create } from "zustand";

type ReportState = {
    report: [];
    revenueId: string;
    isReportModalOpen: boolean;
};

type ReportAction = {
    getReport: () => void;
    openReportModal: (status: boolean, revenueId?: string) => void;
};

const initialState: ReportState = {
    report: [],
    revenueId: "",
    isReportModalOpen: false,
};

export const useReportStore = create<ReportState & ReportAction>()(set => ({
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

    openReportModal: (status, revenueId) => set(() => ({ isReportModalOpen: status, revenueId })),
}));

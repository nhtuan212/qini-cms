import { URL } from "@/config/urls";
import { ReportParams, ReportProps } from "@/types/reportProps";
import { fetchData } from "@/utils/fetch";
import { create } from "zustand";

type ReportState = {
    report: [];
    reportByStaff: ReportProps[];
    revenueId: string;
    isReportModalOpen: boolean;
};

type ReportAction = {
    getReport: () => void;
    getReportByStaff: (id: string) => void;
    filterReportByStaff: ({ id, params }: { id: string; params: ReportParams }) => void;
    openReportModal: (status: boolean, revenueId?: string) => void;
};

const initialState: ReportState = {
    report: [],
    reportByStaff: [],
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
            if (res?.code !== 200) {
                return set({
                    report: res?.message,
                });
            }
            return set({ report: res.data });
        });
    },

    getReportByStaff: async id => {
        return await fetchData({
            endpoint: `${URL.REPORT}/${id}`,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportByStaff: res?.message,
                });
            }

            return set({ reportByStaff: res.data });
        });
    },

    filterReportByStaff: async ({ id, params }: { id: string; params: ReportParams }) => {
        return await fetchData({
            endpoint: `${URL.REPORT}/${id}?startDate=${params.startDate}&endDate=${params.endDate}`,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportByStaff: res?.message,
                });
            }

            return set({ reportByStaff: res.data });
        });
    },

    openReportModal: (status, revenueId) => set(() => ({ isReportModalOpen: status, revenueId })),
}));

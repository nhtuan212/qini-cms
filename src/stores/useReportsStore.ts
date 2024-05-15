import { URL } from "@/config/urls";
import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { reportDetail } from "@/types/reportProps";

type ReportState = {
    isReportLoading?: boolean;
    isReportDetailLoading?: boolean;
    report: [];
    reportDetail: reportDetail;
};

type ReportAction = {
    getReport: () => void;
    getReportDetail: (id: string) => void;
    deleteReport: (id: string) => Promise<void>;
};

const initialState: ReportState = {
    isReportLoading: false,
    isReportDetailLoading: false,
    report: [],
    reportDetail: {},
};

export const useReportsStore = create<ReportState & ReportAction>()(set => ({
    ...initialState,

    // Actions
    getReport: async () => {
        set({
            isReportLoading: true,
        });

        return await fetchData({
            endpoint: URL.REPORT,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    report: res?.message,
                });
            }
            return set({
                isReportLoading: false,
                report: res.data,
            });
        });
    },

    getReportDetail: async (id: string) => {
        set({
            isReportDetailLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.REPORT}/${id}`,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportDetail: res?.message,
                });
            }

            return set({
                isReportDetailLoading: false,
                reportDetail: res.data[0],
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

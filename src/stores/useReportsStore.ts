import { URL } from "@/config/urls";
import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { ReportProps, ReportDetailProps, reportsOnStaffsProps } from "@/types/reportProps";

type ReportState = {
    isReportLoading?: boolean;
    isReportDetailLoading?: boolean;
    report: [];
    reportDetail: ReportDetailProps;
};

type ReportAction = {
    getReport: () => void;
    getReportDetail: (id: string) => Promise<void>;
    createReport: (data: {
        reports: ReportProps;
        reportsOnStaffs: reportsOnStaffsProps;
    }) => Promise<void>;
    updateReport: ({ id, reports }: { id: string; reports: ReportProps }) => Promise<void>;
    deleteReport: (id: string) => Promise<void>;
    resetReport: () => void;
};

const initialState: ReportState = {
    isReportLoading: false,
    isReportDetailLoading: false,
    report: [],
    reportDetail: {
        id: "",
        createAt: new Date(),
        revenue: 0,
        description: "",
        isApproved: false,
        shiftId: "",
        reportsOnStaffs: [
            {
                checkIn: "",
                checkOut: "",
                staff: {
                    id: "",
                    name: "",
                },
                staffId: "",
                target: 0,
                timeWorked: 0,
            },
        ],
        shift: {
            name: "",
        },
    },
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

    createReport: async ({
        reports,
        reportsOnStaffs,
    }: {
        reports: ReportProps;
        reportsOnStaffs: reportsOnStaffsProps;
    }) => {
        const body = JSON.stringify({
            ...reports,
            reportsOnStaffs,
        });

        return await fetchData({
            endpoint: URL.REPORT,
            options: {
                method: "POST",
                body,
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

    updateReport: async ({ id, reports }: { id: string; reports: ReportProps }) => {
        return await fetchData({
            endpoint: `${URL.REPORT}/${id}`,
            options: {
                method: "PUT",
                body: JSON.stringify({ ...reports }),
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

    resetReport: () => {
        return set({
            reportDetail: initialState.reportDetail,
        });
    },
}));

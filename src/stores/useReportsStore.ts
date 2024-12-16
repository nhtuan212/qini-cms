import { URL } from "@/config/urls";
import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { ReportProps, ReportDetailProps, reportsOnStaffsProps } from "@/types/reportProps";
import { STATUS_CODE } from "@/constants";

type ReportState = {
    isLoading?: boolean;
    reports: [];
    reportById: ReportDetailProps;
    reportPagination?: {
        [key: string]: any;
    };
};

type ReportAction = {
    getReport: (params?: { [key: string]: any }) => Promise<void>;
    getReportById: (id: string) => Promise<void>;
    createReport: (data: {
        reports: ReportProps;
        reportsOnStaffs: reportsOnStaffsProps;
    }) => Promise<{
        code: number;
        message: string;
    }>;
    updateReport: ({ id, reports }: { id: string; reports: ReportProps }) => Promise<{
        code: number;
        message: string;
    }>;
    deleteReport: (id: string) => Promise<void>;
    resetReport: () => void;
};

const initialState: ReportState = {
    isLoading: false,
    reports: [],
    reportById: {
        id: "",
        createAt: "",
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

const getUrlSearch = () => {
    return window.location.search.slice(1);
};

export const useReportsStore = create<ReportState & ReportAction>()(set => ({
    ...initialState,

    // Actions
    getReport: async params => {
        const filterParams = new URLSearchParams(params).toString();
        const endpoint = `/report${params ? `&${filterParams}` : `${getUrlSearch() ? `?${getUrlSearch()}` : ""}`}`;

        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reports: res?.message,
                });
            }
            return set({
                isLoading: false,
                reports: res.data,
                reportPagination: res.pagination,
            });
        });
    },

    getReportById: async (id: string) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.REPORT}/${id}`,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportById: res?.message,
                });
            }

            return set({
                isLoading: false,
                reportById: res.data[0],
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
            if (res?.code !== STATUS_CODE.OK) {
                return {
                    code: res?.code,
                    message: res?.message,
                };
            }

            return res.data;
        });
    },

    updateReport: async ({ id, reports }: { id: string; reports: ReportProps }) => {
        return await fetchData({
            endpoint: `${URL.REPORT}/${id}`,
            options: {
                method: "PUT",
                body: JSON.stringify({ ...reports }),
            },
        }).then(res => res);
    },

    deleteReport: async (id: string) => {
        return await fetchData({
            endpoint: URL.REPORT,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => res);
    },

    resetReport: () => {
        return set({
            reportById: initialState.reportById,
        });
    },
}));

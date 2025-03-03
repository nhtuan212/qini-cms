import { URL } from "@/config/urls";
import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE } from "@/constants";

export type ReportProps = {
    [key: string]: any;
};

type ReportState = {
    isLoading?: boolean;
    reports: [];
    reportById: ReportProps & {
        reportsOnStaffs?: [ReportProps];
    };
    reportPagination?: {
        [key: string]: any;
    };
};

type ReportAction = {
    getReport: (params?: { [key: string]: any }) => Promise<void>;
    getReportById: (id: string) => Promise<void>;
    createReport: (data: { reports: ReportProps; reportsOnStaffs: ReportProps }) => Promise<{
        code: number;
        message: string;
    }>;
    updateReport: ({
        id,
        reports,
        reportsOnStaffs,
    }: {
        id: string;
        reports: ReportProps;
        reportsOnStaffs?: ReportProps;
    }) => Promise<{
        code: number;
        message: string;
    }>;
    deleteReport: (id: string) => Promise<void>;
    resetReport: () => void;
};

const initialState: ReportState = {
    isLoading: false,
    reports: [],
    reportById: {},
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
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    reports: res?.message,
                });
            }

            return set({
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
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    reportById: res?.message,
                });
            }

            return set({
                reportById: res.data[0],
            });
        });
    },

    createReport: async ({
        reports,
        reportsOnStaffs,
    }: {
        reports: ReportProps;
        reportsOnStaffs: ReportProps;
    }) => {
        set({
            isLoading: true,
        });

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
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                return {
                    code: res?.code,
                    message: res?.message,
                };
            }

            return res.data;
        });
    },

    updateReport: async ({
        id,
        reports,
        reportsOnStaffs,
    }: {
        id: string;
        reports: ReportProps;
        reportsOnStaffs?: ReportProps;
    }) => {
        set({
            isLoading: true,
        });

        const body = JSON.stringify({
            ...reports,
            reportsOnStaffs,
        });

        return await fetchData({
            endpoint: `${URL.REPORT}/${id}`,
            options: {
                method: "PUT",
                body,
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            return res;
        });
    },

    deleteReport: async (id: string) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.REPORT,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            return res;
        });
    },

    resetReport: () => {
        return set({
            reportById: initialState.reportById,
        });
    },
}));

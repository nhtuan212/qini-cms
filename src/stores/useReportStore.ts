import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { DateValueType } from "react-tailwindcss-datepicker";
import {
    SalaryReportProps,
    SalaryReportModel,
    RevenueReportModel,
    RevenueReportProps,
} from "./models/ReportModel";
import { URL } from "@/config/urls";
import { ReportProps, reportByRevenue, salaryByStaff } from "@/types/reportProps";

type ReportState = {
    report: ReportProps;
    reportByRevenue: reportByRevenue[];
    reportByStaff: SalaryReportProps[];
    salaryByStaff: SalaryReportProps[];
};

type ReportAction = {
    getReport: () => void;
    getReportByRevenue: (id: string) => void;
    getReportByStaff: (id: string) => void;
    getSalaryByStaff: ({
        staffId,
        dateValue,
    }: {
        staffId?: string;
        dateValue: DateValueType;
    }) => void;
    filterReportByStaff: ({ id, params }: { id: string; params: DateValueType }) => Promise<any>;
};

const initialState: ReportState = {
    report: {
        totalTarget: 0,
        totalTime: 0,
        reports: [{}],
    },
    reportByRevenue: [],
    reportByStaff: [],
    salaryByStaff: [],
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

    getReportByRevenue: async id => {
        return await fetchData({
            endpoint: `${URL.REPORT}/revenue/${id}`,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportByRevenue: res?.message,
                });
            }

            return set({
                reportByRevenue: res.data.map((item: RevenueReportProps) =>
                    RevenueReportModel(item),
                ),
            });
        });
    },

    getReportByStaff: async id => {
        return await fetchData({
            endpoint: `${URL.REPORT}/staff/${id}`,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportByStaff: res?.message,
                });
            }

            return set({
                reportByStaff: res.data,
            });
        });
    },

    getSalaryByStaff: async ({
        staffId,
        dateValue,
    }: {
        staffId?: string;
        dateValue: DateValueType;
    }) => {
        const endpoint = `${URL.REPORT}/salary?startDate=${dateValue?.startDate}&endDate=${dateValue?.endDate}${staffId && `&staffId=${staffId}`}`;

        return await fetchData({
            endpoint,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    salaryByStaff: res?.message,
                });
            }

            return set({
                salaryByStaff: res.data.map((item: salaryByStaff) => SalaryReportModel(item)),
            });
        });
    },

    filterReportByStaff: async ({ id, params }: { id: string; params: DateValueType }) => {
        return await fetchData({
            endpoint: `${URL.REPORT}/staff/${id}?startDate=${params?.startDate}&endDate=${params?.endDate}`,
            options: {
                method: "GET",
            },
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportByStaff: res?.message,
                });
            }

            return set({ reportByStaff: res.data });
        });
    },
}));

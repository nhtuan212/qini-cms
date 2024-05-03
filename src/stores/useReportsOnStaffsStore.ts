import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { DateValueType } from "react-tailwindcss-datepicker";
import { ReportByStaff, ReportDetailModel, ReportDetailProps } from "./models/ReportModel";
import { URL } from "@/config/urls";
import { ReportProps, reportDetail } from "@/types/reportProps";

type ReportState = {
    report: ReportProps;
    reportDetail: reportDetail[];
    reportByStaff: ReportByStaff[];
};

type ReportAction = {
    getReportsOnStaffs: () => void;
    getReportDetail: ({ reportId }: { reportId: string }) => void;
    getReportByStaff: ({
        staffId,
        params,
    }: {
        staffId: string;
        params?: DateValueType;
    }) => Promise<any>;
};

const initialState: ReportState = {
    report: {
        totalTarget: 0,
        totalTime: 0,
        reports: [{}],
    },
    reportDetail: [],
    reportByStaff: [],
};

export const useReportsOnStaffsStore = create<ReportState & ReportAction>()(set => ({
    ...initialState,

    // Actions
    getReportsOnStaffs: async () => {
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

    getReportDetail: async ({ reportId }: { reportId: string }) => {
        return await fetchData({
            endpoint: `${URL.REPORTONSTAFF}?reportId=${reportId}`,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportDetail: res?.message,
                });
            }

            return set({
                reportDetail: res.data.map((item: ReportDetailProps) => ReportDetailModel(item)),
            });
        });
    },

    getReportByStaff: async ({ staffId, params }: { staffId: string; params?: DateValueType }) => {
        const url = `${URL.REPORTONSTAFF}?staffId=${staffId}`;
        const endpoint =
            params && params.startDate && params.endDate
                ? `${url}&&startDate=${params.startDate}&endDate=${params.endDate}`
                : `${url}`;

        return await fetchData({
            endpoint,
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
}));

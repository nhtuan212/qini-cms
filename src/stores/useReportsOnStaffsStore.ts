import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { URL } from "@/config/urls";

export type ReportsOnStaffProps = {
    [key: string]: any;
};

type ReportState = {
    isReportsOnStaffLoading: boolean;
    reportsOnStaff: [];
};

type ReportAction = {
    getReportsOnStaff: (
        params: Pick<ReportsOnStaffProps, "staffId" | "startDate" | "endDate">,
    ) => Promise<void>;
};

const initialState: ReportState = {
    isReportsOnStaffLoading: false,
    reportsOnStaff: [],
};

export const useReportsOnStaffsStore = create<ReportState & ReportAction>()(set => ({
    ...initialState,

    getReportsOnStaff: async ({ staffId, startDate, endDate }: ReportsOnStaffProps) => {
        const endpoint = `${URL.REPORT_ON_STAFF}?staffId=${staffId}&startDate=${startDate}&endDate=${endDate}`;

        set({
            isReportsOnStaffLoading: true,
        });

        return await fetchData({
            endpoint,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    reportsOnStaff: res?.message,
                });
            }

            return set({
                isReportsOnStaffLoading: false,
                reportsOnStaff: res.data,
            });
        });
    },
}));

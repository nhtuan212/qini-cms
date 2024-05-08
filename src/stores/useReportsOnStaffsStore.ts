import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { URL } from "@/config/urls";

type ReportState = {
    isReportsOnStaffLoading: boolean;
    reportsOnStaff: [];
};

type ReportAction = {
    getReportsOnStaff: ({
        staffId,
        startDate,
        endDate,
    }: {
        staffId: string;
        startDate?: Date | string | null;
        endDate?: Date | string | null;
    }) => Promise<any>;
};

const initialState: ReportState = {
    isReportsOnStaffLoading: false,
    reportsOnStaff: [],
};

export const useReportsOnStaffsStore = create<ReportState & ReportAction>()(set => ({
    ...initialState,

    getReportsOnStaff: async ({
        staffId,
        startDate,
        endDate,
    }: {
        staffId: string;
        startDate?: Date | string | null;
        endDate?: Date | string | null;
    }) => {
        const url = `${URL.REPORTONSTAFF}?staffId=${staffId}`;
        const endpoint =
            startDate && endDate ? `${url}&&startDate=${startDate}&endDate=${endDate}` : `${url}`;

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

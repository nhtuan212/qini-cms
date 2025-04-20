import { create } from "zustand";
import { convertKeysToCamelCase } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { URL } from "@/constants";

export type TargetStaffProps = {
    [key: string]: any;
};

type TargetStaffState = {
    isLoading: boolean;
    targetByStaffId: TargetStaffProps;
};

type TargetAction = {
    getTargetByStaffId: (params?: string) => Promise<void>;
};

const initialState: TargetStaffState = {
    isLoading: false,
    targetByStaffId: {},
};

export const useTargetStaffStore = create<TargetStaffState & TargetAction>()(set => ({
    ...initialState,

    getTargetByStaffId: async (params?: string) => {
        set({
            isLoading: true,
        });

        const endpoint = `${URL.TARGET_STAFF}${params ? params : ""}`;

        return await fetchData({
            endpoint,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    targetByStaffId: res?.message,
                });
            }

            return set({
                targetByStaffId: convertKeysToCamelCase(res.data),
            });
        });
    },
}));

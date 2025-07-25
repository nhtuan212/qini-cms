import { create } from "zustand";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { URL } from "@/constants";
import { useTargetStore } from "@/stores/useTargetStore";

export type TargetShiftProps = {
    [key: string]: any;
};

type TargetShiftState = {
    isLoading: boolean;
    targetShift: TargetShiftProps;
};

type TargetShiftAction = {
    getTargetShiftById: (id?: string) => Promise<void>;
    updateTargetShift: (params: { id: string; bodyParams: TargetShiftProps }) => Promise<void>;
};

const initialState: TargetShiftState = {
    isLoading: false,
    targetShift: {},
};

export const useTargetShiftStore = create<TargetShiftState & TargetShiftAction>()(set => ({
    ...initialState,

    getTargetShiftById: async (id?: string) => {
        set({
            isLoading: true,
        });

        const endpoint = `${URL.TARGET_SHIFT}/${id}`;

        return await fetchData({
            endpoint,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    targetShift: res?.message,
                });
            }

            return set({
                targetShift: convertKeysToCamelCase(res.data),
            });
        });
    },

    updateTargetShift: async (params: { id: string; bodyParams: TargetShiftProps }) => {
        set({
            isLoading: true,
        });

        const endpoint = `${URL.TARGET_SHIFT}/${params.id}`;

        return await fetchData({
            endpoint,
            options: {
                method: "PUT",
                body: JSON.stringify(convertKeysToSnakeCase(params.bodyParams)),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code === 200) {
                useTargetStore
                    .getState()
                    .updateTargetShiftInTargets(convertKeysToCamelCase(res.data));
            }

            return res;
        });
    },
}));

import { create } from "zustand";
import { URL } from "@/config/urls";
import { convertKeysToCamelCase } from "@/utils";
import { fetchData } from "@/utils/fetch";

export type ShiftProps = {
    [key: string]: any;
};

type ShiftAction = {
    getShifts: () => void;
};

const initialState: ShiftProps = {
    shifts: [],
};

export const useShiftStore = create<ShiftProps & ShiftAction>()(set => ({
    ...initialState,

    // Actions
    getShifts: async () => {
        return await fetchData({
            endpoint: URL.SHIFT,
        }).then(res => {
            if (res?.code === 200) {
                return set({ shifts: convertKeysToCamelCase(res.data) });
            }
            return set({
                shifts: res?.message,
            });
        });
    },
}));

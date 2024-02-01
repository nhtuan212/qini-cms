import { URL } from "@/config/urls";
import { fetchData } from "@/utils/fetch";
import { create } from "zustand";
import { StaffProps } from "@/types/staffProps";

type StaffState = {
    staff: [];
    staffId: StaffProps;
};

type StaffAction = {
    // Api actions
    getStaff: () => void;
    getStaffId: (id: string) => void;
    deleteStaff: (id: string) => Promise<void>;
};

const initialState: StaffState = {
    staff: [],
    staffId: {} as StaffProps,
};

export const useStaffStore = create<StaffState & StaffAction>()(set => ({
    ...initialState,

    // Api Actions
    getStaff: async () => {
        return await fetchData({
            endpoint: URL.STAFF,
        }).then(res => {
            if (res?.code === 200) {
                return set({ staff: res.data });
            }
            return set({
                staff: res?.message,
            });
        });
    },

    getStaffId: async (id: string) => {
        return await fetchData({
            endpoint: `${URL.STAFF}/${id}`,
        }).then(res => {
            if (res?.code === 200) {
                return set({ staffId: res.data });
            }
            return set({
                staff: res?.message,
            });
        });
    },

    deleteStaff: async (id: string) => {
        return await fetchData({
            endpoint: URL.STAFF,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => {
            if (res?.code === 200) {
                return set({ staff: res.data });
            }
            return set({
                staff: res?.message,
            });
        });
    },
}));

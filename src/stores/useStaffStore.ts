import { URL } from "@/config/urls";
import { fetchData } from "@/utils/fetch";
import { create } from "zustand";
import { StaffProps } from "@/types/staffProps";

type StaffState = {
    staff: StaffProps[];
    staffById: StaffProps;
};

type StaffAction = {
    // Api actions
    getStaff: () => void;
    getStaffById: (id: string) => void;
    addStaff: (name: string) => Promise<any>;
    editStaff: ({ id, name }: { id: string; name: string }) => Promise<any>;
    deleteStaff: (id: string) => Promise<void>;
};

const initialState: StaffState = {
    staff: [],
    staffById: {} as StaffProps,
};

export const useStaffStore = create<StaffState & StaffAction>()(set => ({
    ...initialState,

    // Api Actions
    getStaff: async () => {
        return await fetchData({
            endpoint: URL.STAFF,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    staff: res?.message,
                });
            }
            return set({ staff: res.data });
        });
    },

    getStaffById: async id => {
        return await fetchData({
            endpoint: `${URL.STAFF}/${id}`,
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    staffById: res?.message,
                });
            }
            return set({ staffById: res.data });
        });
    },

    addStaff: async name => {
        return await fetchData({
            endpoint: URL.STAFF,
            options: {
                method: "POST",
                body: JSON.stringify({
                    name,
                }),
            },
        }).then(res => res);
    },

    editStaff: async ({ id, name }: { id: string; name: string }) => {
        return await fetchData({
            endpoint: `${URL.STAFF}/${id}`,
            options: {
                method: "PUT",
                body: JSON.stringify({
                    name,
                }),
            },
        }).then(res => res);
    },

    deleteStaff: async (id: string) => {
        return await fetchData({
            endpoint: URL.STAFF,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => {
            if (res?.code !== 200) {
                return set({
                    staff: res?.message,
                });
            }

            return set({ staff: res.data });
        });
    },
}));

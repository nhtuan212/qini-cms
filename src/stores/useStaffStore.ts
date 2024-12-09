import { URL } from "@/config/urls";
import { fetchData } from "@/utils/fetch";
import { create } from "zustand";
import { StaffProps } from "@/types/staffProps";

type StaffState = {
    isLoading?: boolean;
    staff: StaffProps[];
    staffById: StaffProps;
};

export type StaffData = {
    name: string;
};

type StaffAction = {
    // Api actions
    getStaff: () => Promise<void>;
    getStaffById: (id: string) => Promise<void>;
    addStaff: ({ staffData }: { staffData: StaffData }) => Promise<any>;
    editStaff: ({ id, staffData }: { id: string; staffData: StaffData }) => Promise<any>;
    deleteStaff: (id: string) => Promise<void>;
};

const initialState: StaffState = {
    isLoading: false,
    staff: [],
    staffById: {} as StaffProps,
};

export const useStaffStore = create<StaffState & StaffAction>()(set => ({
    ...initialState,

    // Api Actions
    getStaff: async () => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.STAFF,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    staff: res?.message,
                });
            }
            return set({ staff: res.data });
        });
    },

    getStaffById: async (id: string) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.STAFF}/${id}`,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    staffById: res?.message,
                });
            }
            return set({
                staffById: res.data,
            });
        });
    },

    addStaff: async ({ staffData }: { staffData: StaffData }) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.STAFF,
            options: {
                method: "POST",
                body: JSON.stringify({
                    ...staffData,
                }),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            return res;
        });
    },

    editStaff: async ({ id, staffData }: { id: string; staffData: StaffData }) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.STAFF}/${id}`,
            options: {
                method: "PUT",
                body: JSON.stringify({
                    ...staffData,
                }),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            return res;
        });
    },

    deleteStaff: async (id: string) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.STAFF,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    staff: res?.message,
                });
            }

            return set({ staff: res.data });
        });
    },
}));

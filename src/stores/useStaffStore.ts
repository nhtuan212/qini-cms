import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { URL } from "@/constants";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "@/utils";

export type StaffProps = {
    [key: string]: any;
};

type StaffState = {
    isLoading?: boolean;
    isValidatePasswordLoading?: boolean;
    staff: StaffProps[];
    staffById: StaffProps;
};

type StaffAction = {
    getStaff: () => Promise<void>;
    getStaffById: (id: StaffProps["id"]) => Promise<StaffProps>;
    createStaff: (bodyParams: StaffProps) => Promise<StaffProps>;
    updateStaff: ({
        id,
        bodyParams,
    }: {
        id: StaffProps["id"];
        bodyParams: StaffProps;
    }) => Promise<StaffProps>;
    deleteStaff: (id: StaffProps["id"]) => Promise<void>;
    validateStaffPassword: (id: StaffProps["id"], password: string) => Promise<StaffProps>;
};

const initialState: StaffState = {
    isLoading: false,
    staff: [],
    staffById: {} as StaffProps,
};

export const useStaffStore = create<StaffState & StaffAction>()((set, get) => ({
    ...initialState,

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

            return set({ staff: convertKeysToCamelCase(res.data) as StaffProps[] });
        });
    },

    getStaffById: async id => {
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

            set({
                staffById: res.data,
            });

            return res.data;
        });
    },

    createStaff: async bodyParams => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.STAFF,
            options: {
                method: "POST",
                body: JSON.stringify(bodyParams),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            return res;
        });
    },

    updateStaff: async ({ id, bodyParams }) => {
        set({
            isLoading: true,
        });

        const body = JSON.stringify(convertKeysToSnakeCase(bodyParams));

        return await fetchData({
            endpoint: `${URL.STAFF}/${id}`,
            options: {
                method: "PUT",
                body,
            },
        }).then(res => {
            const data = convertKeysToCamelCase(res.data) as StaffProps;

            set({
                isLoading: false,
                staff: get().staff.map(s => (s.id === res.data.id ? res.data : s)),
            });

            return data;
        });
    },

    deleteStaff: async id => {
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

    validateStaffPassword: async (id, password) => {
        set({
            isValidatePasswordLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.STAFF}/${id}/validate-password`,
            options: {
                method: "POST",
                body: JSON.stringify({ password }),
            },
        })
            .then(res => {
                set({
                    isValidatePasswordLoading: false,
                });

                if (res?.code === 200) {
                    return {
                        isValid: true,
                        code: res.code,
                        staff: res.data,
                    };
                }

                return {
                    isValid: false,
                    message: res?.message || "Invalid password",
                };
            })
            .catch(err => {
                set({
                    isValidatePasswordLoading: false,
                });

                return {
                    isValid: false,
                    message: err.message,
                };
            });
    },
}));

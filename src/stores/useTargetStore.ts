import { URL } from "@/config/urls";
import { create } from "zustand";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE } from "@/constants";

export type TargetProps = {
    [key: string]: any;
};

type TargetState = {
    isLoading?: boolean;
    targets: TargetProps[];
    targetById: TargetProps;
    targetPagination?: {
        [key: string]: any;
    };
};

type TargetAction = {
    getTarget: (params?: string) => Promise<void>;
    getTargetById: (id: TargetProps["id"]) => Promise<TargetProps>;
    updateTarget: ({
        id,
        bodyParams,
    }: {
        id: TargetProps["id"];
        bodyParams: { [key: string]: any };
    }) => Promise<TargetProps>;
    createTarget: (bodyParams: TargetProps) => Promise<TargetProps>;
    deleteTarget: (id: TargetProps["id"]) => Promise<void>;
    emptyTargetById: () => void;
};

const initialState: TargetState = {
    isLoading: false,
    targets: [],
    targetById: {} as TargetProps,
};

export const useTargetStore = create<TargetState & TargetAction>()(set => ({
    ...initialState,

    getTarget: async params => {
        set({
            isLoading: true,
        });

        const endpoint = `${URL.TARGET}${params ? params : ""}`;

        return await fetchData({
            endpoint,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    targets: res?.message,
                });
            }

            return set({
                targets: res.data.map((item: TargetProps) => convertKeysToCamelCase(item)),
                targetPagination: res.pagination,
            });
        });
    },

    getTargetById: async id => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.TARGET}/${id}`,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    targetById: res?.message,
                });
            }

            set({
                targetById: convertKeysToCamelCase(res.data),
            });

            return res.data;
        });
    },

    createTarget: async bodyParams => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.TARGET,
            options: {
                method: "POST",
                body: JSON.stringify(convertKeysToSnakeCase(bodyParams)),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code === STATUS_CODE.OK) {
                return console.error("Error creating target", res);
            }

            set(state => ({
                targets: [convertKeysToCamelCase(res.data), ...state.targets],
            }));

            return res;
        });
    },

    updateTarget: async ({
        id,
        bodyParams,
    }: {
        id: TargetProps["id"];
        bodyParams: TargetProps;
    }) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.TARGET}/${id}`,
            options: {
                method: "PUT",
                body: JSON.stringify(convertKeysToSnakeCase(bodyParams)),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                return console.error("Error updating target", res);
            }

            set(state => ({
                targets: state.targets.map((item: TargetProps) =>
                    item.id === id ? convertKeysToCamelCase(res.data) : item,
                ),
            }));

            return res;
        });
    },

    deleteTarget: async id => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.TARGET,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                return console.error("Error deleting target");
            }

            set(state => ({
                targets: state.targets.filter((item: TargetProps) => item.id !== id),
            }));

            return res;
        });
    },

    emptyTargetById: () => set({ targetById: {} }),
}));

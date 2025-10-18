import { create } from "zustand";
import { convertKeysToCamelCase } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE, URL } from "@/constants";

export type WorkTypeProps = {
    [key: string]: any;
};

type WorkTypeAction = {
    getWorkTypes: () => Promise<void>;
    getWorkTypeById: (id: string) => Promise<WorkTypeProps>;
    createWorkType: (data: WorkTypeProps) => Promise<WorkTypeProps>;
    updateWorkType: (id: string, data: WorkTypeProps) => Promise<WorkTypeProps>;
    deleteWorkType: (id: string) => Promise<WorkTypeProps>;
    resetWorkTypeById: () => void;
};

type WorkTypeState = {
    isLoading: boolean;
    workTypes: WorkTypeProps[];
    workTypeById: WorkTypeProps;
};

const initialState: WorkTypeState = {
    isLoading: false,
    workTypes: [],
    workTypeById: {},
};

export const useWorkTypeStore = create<WorkTypeState & WorkTypeAction>()((set, get) => ({
    ...initialState,

    // Actions

    getWorkTypes: async () => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.WORK_TYPE,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                throw new Error(res?.message);
            }

            return set({
                workTypes: res.data.map((item: WorkTypeProps) => convertKeysToCamelCase(item)),
            });
        });
    },

    getWorkTypeById: async (id: string) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.WORK_TYPE}/${id}`,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                throw new Error(res?.message);
            }

            set({
                workTypeById: convertKeysToCamelCase(res.data),
            });

            return convertKeysToCamelCase(res.data);
        });
    },

    createWorkType: async (data: WorkTypeProps) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.WORK_TYPE,
            options: { method: "POST", body: JSON.stringify(data) },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                throw new Error(res?.message);
            }

            set(state => ({
                workTypes: [
                    ...state.workTypes,
                    ...res.data.map((item: WorkTypeProps) => convertKeysToCamelCase(item)),
                ],
            }));

            return convertKeysToCamelCase(res.data);
        });
    },

    updateWorkType: async (id: string, data: WorkTypeProps) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.WORK_TYPE}/${id}`,
            options: { method: "PUT", body: JSON.stringify(data) },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                throw new Error(res?.message);
            }

            set(() => ({
                workTypes: get().workTypes.map(workType =>
                    workType.id === id
                        ? res.data.find((item: WorkTypeProps) => convertKeysToCamelCase(item))
                        : workType,
                ),
            }));

            return convertKeysToCamelCase(res.data);
        });
    },

    deleteWorkType: async (id: string) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.WORK_TYPE}/${id}`,
            options: { method: "DELETE" },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                throw new Error(res?.message);
            }

            set(state => ({
                workTypes: state.workTypes.filter(workType => workType.id !== id),
            }));

            return convertKeysToCamelCase(res.data);
        });
    },

    resetWorkTypeById: () => {
        set({
            workTypeById: {},
        });
    },
}));

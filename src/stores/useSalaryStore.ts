import { create } from "zustand";
import { convertKeysToCamelCase } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE, URL } from "@/constants";

export type SalaryProps = {
    [key: string]: any;
};

type SalaryAction = {
    getSalaries: (staffId?: string) => void;
    createSalary: (bodyParams: any) => Promise<void>;
    deleteSalary: (id: string) => Promise<void>;
    cleanUpSalary: () => void;
};

const initialState: SalaryProps = {
    isLoading: false,
    salaries: [],
};

export const useSalaryStore = create<SalaryProps & SalaryAction>()(set => ({
    ...initialState,

    // Actions
    getSalaries: async staffId => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.SALARY}${staffId ? `/staff/${staffId}` : ""}`,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code === STATUS_CODE.OK) {
                return set({ salaries: convertKeysToCamelCase(res.data) });
            }

            return set({
                salaries: res?.message,
            });
        });
    },

    createSalary: async bodyParams => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.SALARY,
            options: { method: "POST", body: JSON.stringify(bodyParams) },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                return set({
                    salaries: res?.message,
                });
            }

            return set(state => ({
                salaries: [convertKeysToCamelCase(res.data), ...state.salaries],
            }));
        });
    },

    deleteSalary: async id => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.SALARY}/${id}`,
            options: { method: "DELETE" },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                return set({
                    salaries: res?.message,
                });
            }

            return set(state => ({
                salaries: state.salaries.filter((salary: SalaryProps) => salary.id !== id),
            }));
        });
    },

    cleanUpSalary: () => {
        set({
            salaries: [],
        });
    },
}));

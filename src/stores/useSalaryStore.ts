import { create } from "zustand";
import { camelCaseQueryString, convertKeysToCamelCase } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE, URL } from "@/constants";

export type SalaryProps = {
    [key: string]: any;
};

type SalaryAction = {
    getSalaries: (params?: any) => Promise<void>;
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
    getSalaries: async params => {
        set({
            isLoading: true,
        });

        let endpoint = URL.SALARY;
        if (params?.staffId) endpoint += `${URL.STAFF}/${params.staffId}`;
        if (params?.startDate && params?.endDate) {
            endpoint += camelCaseQueryString({
                startDate: params.startDate,
                endDate: params.endDate,
            });
        }

        return await fetchData({
            endpoint,
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

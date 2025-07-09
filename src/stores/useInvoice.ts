import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE, URL } from "@/constants";

export type InvoiceProps = {
    [key: string]: any;
};

type InvoiceState = {
    isLoading: boolean;
    invoice: InvoiceProps;
};

type InvoiceAction = {
    getInvoice: (invoice: InvoiceProps) => Promise<InvoiceProps>;
};

const initialState: InvoiceState = {
    isLoading: false,
    invoice: {},
};

export const useInvoiceStore = create<InvoiceProps & InvoiceAction>()(set => ({
    ...initialState,

    getInvoice: async (params: InvoiceProps) => {
        set({
            isLoading: true,
        });

        const endpoint = `${URL.INVOICE}?${new URLSearchParams(params).toString()}`;

        return await fetchData({
            endpoint,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.statusCode !== STATUS_CODE.OK) {
                return set({
                    invoice: res?.message,
                });
            }

            set({
                invoice: res.data,
            });

            return res.data;
        });
    },
}));

import { create } from "zustand";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE, URL } from "@/constants";

export type InvoiceProps = {
    [key: string]: any;
};

const initialState: InvoiceProps = {
    invoice: {},
};

type InvoiceAction = {
    getInvoice: (invoice: InvoiceProps) => Promise<InvoiceProps>;
};

export const useInvoiceStore = create<InvoiceProps & InvoiceAction>()(set => ({
    ...initialState,

    getInvoice: async (params: InvoiceProps) => {
        const endpoint = `${URL.INVOICE}?${new URLSearchParams(params).toString()}`;

        return await fetchData({
            endpoint,
        }).then(res => {
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

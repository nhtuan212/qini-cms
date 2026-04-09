import { useQueryClient } from "@tanstack/react-query";
import { fetchData } from "..";
import { URL } from "@/constants";
import { buildParamUrl, convertKeysToCamelCase } from "@/utils";
import { InvoiceProps } from "@/types";

export const useInvoice = () => {
    const queryClient = useQueryClient();
    const endpoint = URL.INVOICE;
    const queryKey = ["invoice"];

    // Trigger action when handle click function
    const getInvoice = (params: InvoiceProps) =>
        queryClient.fetchQuery({
            queryKey,
            queryFn: () =>
                fetchData({
                    endpoint: buildParamUrl(endpoint, params),
                }).then(res => convertKeysToCamelCase(res.data)),
        });

    return {
        getInvoice,
    };
};

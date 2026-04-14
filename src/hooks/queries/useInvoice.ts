import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchData } from "..";
import { buildParamUrl, convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { InvoiceProps } from "@/types";

export const useInvoice = () => {
    const queryClient = useQueryClient();
    const endpoint = URL.INVOICE;
    const queryKey = ["invoice"];

    //** States */
    const [isLoading, setIsLoading] = useState(false);

    // Trigger action when handle click function
    const getInvoice = async (params: InvoiceProps) => {
        setIsLoading(true);

        try {
            return await queryClient.fetchQuery({
                queryKey: [...queryKey, params],
                queryFn: () =>
                    fetchData({
                        endpoint: buildParamUrl(endpoint, params),
                    }).then(res => convertKeysToCamelCase(res.data)),
                staleTime: 60 * 1000, // 1 mins
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        getInvoice,

        isLoading,
    };
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "..";
import { buildParamUrl, convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { CreateSalaryProps, SalaryListProps, SalaryParams, SalaryProps } from "@/types";

export const useSalary = (params?: SalaryParams) => {
    const { userId, ...queryParams } = params || {};

    const queryClient = useQueryClient();

    const baseEndpoint = userId ? `${URL.SALARY}${URL.USER}/${userId}` : URL.SALARY;
    const endpoint = buildParamUrl(baseEndpoint, queryParams);

    // GET
    const { isPending, isFetching, data } = useQuery<SalaryListProps>({
        queryKey: ["salary", params],
        queryFn: () =>
            fetchData({
                endpoint,
            }).then(res => ({
                salaries: convertKeysToCamelCase(res.data),
                totalAmount: res.totalAmount || 0,
                startDate: res.startDate,
                endDate: res.endDate,
            })),
    });

    const { salaries = [], totalAmount = 0, startDate, endDate } = data || {};

    // POST
    const { isPending: isCreating, mutateAsync: createSalary } = useMutation<
        SalaryProps,
        Error,
        CreateSalaryProps
    >({
        mutationFn: bodyParams =>
            fetchData({
                endpoint: URL.SALARY,
                options: {
                    method: "POST",
                    body: JSON.stringify(bodyParams),
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: () => {
            // re-fetching list
            queryClient.invalidateQueries({ queryKey: ["salary"] });
        },
    });

    // DELETE
    const { isPending: isDeleting, mutateAsync: deleteSalary } = useMutation<
        SalaryProps,
        Error,
        SalaryProps["id"]
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${URL.SALARY}/${id}`,
                options: {
                    method: "DELETE",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: () => {
            // re-fetching list
            queryClient.invalidateQueries({ queryKey: ["salary"] });
        },
    });

    return {
        isPending,
        isFetching,
        salaries,
        totalAmount,
        period: { startDate, endDate },

        isCreating,
        createSalary,

        isDeleting,
        deleteSalary,

        isLoading: isPending || isFetching || isCreating || isDeleting,
    };
};

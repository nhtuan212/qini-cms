import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "..";
import { buildParamUrl, convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { CreateSalaryProps, SalaryListProps, SalaryParams, SalaryProps } from "@/types";

export const useSalary = (params?: SalaryParams) => {
    const { staffId, ...queryParams } = params || {};

    const queryClient = useQueryClient();

    const baseEndpoint = staffId ? `${URL.SALARY}${URL.STAFF}/${staffId}` : URL.SALARY;
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
            })),
    });

    const { salaries = [], totalAmount = 0 } = data || {};

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

        isCreating,
        createSalary,

        isDeleting,
        deleteSalary,

        isLoading: isPending || isFetching || isCreating || isDeleting,
    };
};

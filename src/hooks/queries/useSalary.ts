import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "..";
import { buildParamUrl, convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { CreateSalaryProps, SalaryParams, SalaryProps } from "@/types";

export const useSalary = (params?: SalaryParams) => {
    const queryClient = useQueryClient();
    const endpoint = buildParamUrl(URL.SALARY, params);

    // GET
    const {
        isPending,
        isFetching,
        data: salaries = [],
    } = useQuery<SalaryProps[]>({
        queryKey: ["salary", params],
        queryFn: () =>
            fetchData({
                endpoint,
            }).then(res => convertKeysToCamelCase(res.data)),
    });

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

        isCreating,
        createSalary,

        isDeleting,
        deleteSalary,
    };
};

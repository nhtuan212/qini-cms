import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/hooks";
import { convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { EmployeeProps } from "@/types";

type UpdateEmployeeProps = { id: EmployeeProps["id"]; params: Partial<EmployeeProps> };

export const useEmployee = () => {
    const queryClient = useQueryClient();
    const endpoint = URL.EMPLOYEE;
    const queryKey = ["employee"];

    // Get employee
    const {
        isPending,
        isFetching,
        data: employees = [],
    } = useQuery<EmployeeProps[]>({
        queryKey,
        queryFn: () =>
            fetchData({
                endpoint,
            }).then(res => convertKeysToCamelCase(res.data)),
    });

    const { isPending: isCreating, mutateAsync: createEmployee } = useMutation<
        EmployeeProps[],
        Error,
        Pick<EmployeeProps, "name" | "salary" | "salaryType" | "isTarget" | "isActive">
    >({
        mutationFn: params =>
            fetchData({
                endpoint,
                options: {
                    method: "POST",
                    body: JSON.stringify(params),
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            queryClient.setQueryData<EmployeeProps[]>(queryKey, old => [res[0], ...(old ?? [])]);
        },
    });

    // Update Employee
    const { isPending: isUpdating, mutateAsync: updateEmployee } = useMutation<
        EmployeeProps,
        Error,
        UpdateEmployeeProps
    >({
        mutationFn: ({ id, params }) =>
            fetchData({
                endpoint: `${endpoint}/${id}`,
                options: {
                    method: "PUT",
                    body: JSON.stringify(params),
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            queryClient.setQueriesData({ queryKey }, (prev: EmployeeProps[]) =>
                prev?.map(employee => (employee.id === res.id ? res : employee)),
            );
        },
    });

    // Delete employee
    const { isPending: isDeleting, mutateAsync: deleteEmployee } = useMutation<
        EmployeeProps,
        Error,
        EmployeeProps["id"]
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${endpoint}/${id}`,
                options: {
                    method: "DELETE",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            // Remove employee from the list
            queryClient.setQueriesData({ queryKey }, (prev: EmployeeProps[]) => {
                return prev.filter(employee => employee.id !== res.id);
            });
        },
    });

    return {
        employees,
        isPending,
        isFetching,

        isCreating,
        createEmployee,

        isUpdating,
        updateEmployee,

        isDeleting,
        deleteEmployee,

        isLoading: isPending || isFetching || isCreating || isUpdating || isDeleting,
    };
};

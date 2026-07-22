import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/hooks";
import { convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { EmployeeProps, UserProps } from "@/types";

export const useUser = () => {
    const queryClient = useQueryClient();
    const endpoint = URL.USER;
    const employeeQueryKey = ["employee"];

    const syncEmployeeActive = (users?: UserProps[]) => {
        queryClient.setQueriesData({ queryKey: employeeQueryKey }, (prev: EmployeeProps[]) => {
            return prev?.map(employee => {
                const updated = users?.find(user => user.id === employee.userId);
                return updated ? { ...employee, isActive: updated.isActive } : employee;
            });
        });
    };

    // Deactivate user (set isActive = false; keeps employee visible)
    const { isPending: isInactive, mutateAsync: inActiveUser } = useMutation<
        UserProps[],
        Error,
        UserProps["id"]
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${endpoint}/${id}/in-active`,
                options: {
                    method: "PUT",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: syncEmployeeActive,
    });

    // Reset password to default (handled by BE)
    const { isPending: isResetting, mutateAsync: resetPassword } = useMutation<
        void,
        Error,
        UserProps["id"]
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${endpoint}/${id}/reset-password`,
                options: {
                    method: "POST",
                },
            }),
    });

    return {
        isInactive,
        inActiveUser,

        isResetting,
        resetPassword,

        isLoading: isInactive || isResetting,
    };
};

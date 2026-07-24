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

    // Soft delete user (BE sets deletedAt) → drop the matching employee from the list
    const removeDeletedEmployee = (users?: UserProps[]) => {
        queryClient.setQueriesData({ queryKey: employeeQueryKey }, (prev: EmployeeProps[]) => {
            return prev?.filter(employee => !users?.some(user => user.id === employee.userId));
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

    // Delete User
    const { isPending: isDeleting, mutateAsync: deleteUser } = useMutation<
        UserProps[],
        Error,
        UserProps["id"]
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${endpoint}/${id}`,
                options: {
                    method: "DELETE",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: removeDeletedEmployee,
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

        isDeleting,
        deleteUser,

        isResetting,
        resetPassword,

        isLoading: isInactive || isDeleting || isResetting,
    };
};

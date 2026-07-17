import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/hooks";
import { convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { StaffProps } from "@/types/staff";

type UpdateStaffProps = { id: StaffProps["id"]; params: Partial<StaffProps> };

export const useStaff = () => {
    const queryClient = useQueryClient();
    const endpoint = URL.EMPLOYEE;
    const queryKey = ["staff"];

    // Get staff
    const {
        isPending,
        isFetching,
        data: staffs = [],
    } = useQuery<StaffProps[]>({
        queryKey,
        queryFn: () =>
            fetchData({
                endpoint,
            }).then(res => convertKeysToCamelCase(res.data)),
    });

    // Create staff
    const { isPending: isCreating, mutateAsync: createStaff } = useMutation<
        StaffProps[],
        Error,
        Pick<StaffProps, "name" | "salary" | "password" | "salaryType" | "isTarget">
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
            queryClient.setQueryData<StaffProps[]>(queryKey, old => [res[0], ...(old ?? [])]);
        },
    });

    // Update Staff
    const { isPending: isUpdating, mutateAsync: updateStaff } = useMutation<
        StaffProps,
        Error,
        UpdateStaffProps
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
            queryClient.setQueriesData({ queryKey }, (prev: StaffProps[]) =>
                prev?.map(staff => (staff.id === res.id ? res : staff)),
            );
        },
    });

    // In-active staff
    const { isPending: isInactive, mutateAsync: inActiveStaff } = useMutation<
        StaffProps,
        Error,
        StaffProps["id"]
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${endpoint}/${id}/in-active`,
                options: {
                    method: "PUT",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            queryClient.setQueriesData({ queryKey }, (prev: StaffProps[]) => {
                return prev?.map(staff =>
                    staff.id === res.id
                        ? {
                              ...staff,
                              isActive: false,
                          }
                        : staff,
                );
            });
        },
    });

    // Delete staff
    const { isPending: isDeleting, mutateAsync: deleteStaff } = useMutation<
        StaffProps,
        Error,
        StaffProps["id"]
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${endpoint}/${id}`,
                options: {
                    method: "DELETE",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            // Remove staff from the list
            queryClient.setQueriesData({ queryKey }, (prev: StaffProps[]) => {
                return prev.filter(staff => staff.id !== res.id);
            });
        },
    });

    return {
        staffs,
        isPending,
        isFetching,

        isCreating,
        createStaff,

        isUpdating,
        updateStaff,

        isInactive,
        inActiveStaff,

        isDeleting,
        deleteStaff,

        isLoading: isPending || isFetching || isCreating || isUpdating || isInactive || isDeleting,
    };
};

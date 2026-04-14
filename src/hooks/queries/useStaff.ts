import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/hooks";
import { convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { StaffProps } from "@/types/staff";

export const useStaff = () => {
    const queryClient = useQueryClient();
    const endpoint = URL.STAFF;

    // Get staff
    const {
        isPending,
        isFetching,
        data: staffs = [],
    } = useQuery<StaffProps[]>({
        queryKey: ["staff"],
        queryFn: () =>
            fetchData({
                endpoint,
            }).then(res => convertKeysToCamelCase(res.data)),
    });

    // Create staff
    const { isPending: isCreating, mutateAsync: createStaff } = useMutation<
        StaffProps[],
        Error,
        StaffProps
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
            queryClient.setQueryData<StaffProps[]>(["staff"], old => [res[0], ...(old ?? [])]);
        },
    });

    // Validate staff password
    const {
        isPending: isValidation,
        isIdle,
        mutateAsync: validateStaffPassword,
    } = useMutation<StaffProps, Error, StaffProps>({
        mutationFn: ({ id, password }) =>
            fetchData({
                endpoint: `${URL.STAFF}/${id}/validate-password`,
                options: {
                    method: "POST",
                    body: JSON.stringify({ password }),
                },
            }).then(res => res),
    });

    // Update Staff
    const { isPending: isUpdating, mutateAsync: updateStaff } = useMutation<
        StaffProps,
        Error,
        StaffProps
    >({
        mutationFn: ({ id, params }) =>
            fetchData({
                endpoint: `${URL.STAFF}/${id}`,
                options: {
                    method: "PUT",
                    body: JSON.stringify(params),
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            queryClient.setQueryData<StaffProps[]>(
                ["staff"],
                old => old?.map(staff => (staff.id === res.id ? res : staff)) ?? [],
            );
        },
    });

    // In-active staff
    const { isPending: isInactive, mutateAsync: inActiveStaff } = useMutation({
        mutationFn: id =>
            fetchData({
                endpoint: `${URL.STAFF}/${id}/in-active`,
                options: {
                    method: "PUT",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: (_, id) => {
            queryClient.setQueryData<StaffProps[]>(["staff"], old =>
                old?.map(staff =>
                    staff.id === id
                        ? {
                              ...staff,
                              isActive: false,
                          }
                        : staff,
                ),
            );
        },
    });

    // Delete staff
    const { isPending: isDeleting, mutateAsync: deleteStaff } = useMutation<
        StaffProps,
        Error,
        StaffProps
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${URL.STAFF}/${id}`,
                options: {
                    method: "DELETE",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            // Remove staff from the list
            queryClient.setQueryData<StaffProps[]>(["staff"], old =>
                old?.filter(staff => staff.id !== res[0].id),
            );
        },
    });

    return {
        staffs,
        isPending,
        isFetching,

        isCreating,
        createStaff,

        isValidation,
        isIdle,
        validateStaffPassword,

        isUpdating,
        updateStaff,

        isInactive,
        inActiveStaff,

        isDeleting,
        deleteStaff,

        isLoading:
            isPending ||
            isFetching ||
            isCreating ||
            isValidation ||
            isUpdating ||
            isInactive ||
            isDeleting,
    };
};

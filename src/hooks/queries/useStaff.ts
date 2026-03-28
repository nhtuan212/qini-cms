import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/hooks";
import { convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { StaffProps } from "@/types/staff";

export const useStaff = () => {
    const queryClient = useQueryClient();
    const endpoint = URL.STAFF;

    // GET
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

    // POST
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

    // PUT
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

    // DELETE
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
            queryClient.setQueryData<StaffProps[]>(
                ["staff"],
                old => old?.filter(staff => staff.id !== res[0].id) ?? [],
            );
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

        isDeleting,
        deleteStaff,

        isLoading: isPending || isFetching || isCreating || isUpdating || isDeleting,
    };
};

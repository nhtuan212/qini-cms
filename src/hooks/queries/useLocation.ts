import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/hooks";
import { convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { LocationProps } from "@/types";

type CreateLocationProps = Pick<LocationProps, "name" | "lat" | "lng" | "radius" | "isActive">;
type UpdateLocationProps = { id: LocationProps["id"]; params: Partial<LocationProps> };

export const useLocation = () => {
    const queryClient = useQueryClient();
    const endpoint = URL.LOCATION;
    const queryKey = ["location"];

    // Get locations
    const {
        isPending,
        isFetching,
        data: locations = [],
    } = useQuery<LocationProps[]>({
        queryKey,
        queryFn: () =>
            fetchData({
                endpoint,
            }).then(res => convertKeysToCamelCase(res.data)),
    });

    // Create location
    const { isPending: isCreating, mutateAsync: createLocation } = useMutation<
        LocationProps,
        Error,
        CreateLocationProps
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
            queryClient.setQueryData<LocationProps[]>(queryKey, old => [res, ...(old ?? [])]);
        },
    });

    // Update location
    const { isPending: isUpdating, mutateAsync: updateLocation } = useMutation<
        LocationProps,
        Error,
        UpdateLocationProps
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
            queryClient.setQueriesData({ queryKey }, (prev: LocationProps[]) =>
                prev?.map(location => (location.id === res.id ? res : location)),
            );
        },
    });

    // Delete location
    const { isPending: isDeleting, mutateAsync: deleteLocation } = useMutation<
        LocationProps,
        Error,
        LocationProps["id"]
    >({
        mutationFn: id =>
            fetchData({
                endpoint: `${endpoint}/${id}`,
                options: {
                    method: "DELETE",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            queryClient.setQueriesData({ queryKey }, (prev: LocationProps[]) =>
                prev?.filter(location => location.id !== res.id),
            );
        },
    });

    return {
        locations,
        isPending,
        isFetching,

        isCreating,
        createLocation,

        isUpdating,
        updateLocation,

        isDeleting,
        deleteLocation,

        isLoading: isPending || isFetching || isCreating || isUpdating || isDeleting,
    };
};

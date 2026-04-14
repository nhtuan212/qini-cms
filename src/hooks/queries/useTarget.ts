import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "..";
import { camelCaseQueryString, convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { TargetProps } from "@/types";
import { CalendarDate } from "@internationalized/date";

export const useTarget = (params?: {
    startDate: string | CalendarDate;
    endDate: string | CalendarDate;
}) => {
    const queryClient = useQueryClient();
    const endpoint = URL.TARGET;
    const queryString = params ? camelCaseQueryString(params) : "";

    // Get target with params
    const {
        isPending,
        isFetching,
        data: targets = [],
    } = useQuery<TargetProps[]>({
        queryKey: ["target", params],
        queryFn: async () => {
            return fetchData({
                endpoint: `${endpoint}${queryString}`,
            }).then(res => convertKeysToCamelCase(res.data));
        },
    });

    // Create target
    const { isPending: isCreating, mutateAsync: createTarget } = useMutation<
        TargetProps,
        Error,
        Pick<TargetProps, "name" | "targetAt">
    >({
        mutationFn: bodyParams =>
            fetchData({
                endpoint,
                options: {
                    method: "POST",
                    body: JSON.stringify(bodyParams),
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: () => {
            // Because the response doesn't match with cache
            queryClient.invalidateQueries({
                queryKey: ["target"],
                refetchType: "all",
            });
        },
    });

    return {
        targets,
        isPending,

        isCreating,
        createTarget,

        isLoading: isPending || isFetching || isCreating,
    };
};

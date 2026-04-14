import { URL } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "..";
import { convertKeysToCamelCase } from "@/utils";
import { TargetProps, TargetShiftProps } from "@/types";

interface UpdateTargetShiftProps {
    id: TargetShiftProps["id"];
    params: Pick<TargetShiftProps, "revenue" | "transfer" | "point" | "cash" | "description">;
}

export const useTargetShift = () => {
    const endpoint = URL.TARGET_SHIFT;
    const queryClient = useQueryClient();
    const queryKey = ["targetShift"];

    const updateTarget = (res: TargetShiftProps) =>
        queryClient.setQueriesData({ queryKey: ["target"] }, (targets: TargetProps[]) => {
            return targets.map(target => ({
                ...target,
                targetShifts: target.targetShifts.map(tgs => {
                    return tgs.id === res.id
                        ? {
                              ...tgs,
                              revenue: res.revenue,
                              transfer: res.transfer,
                              cash: res.cash,
                              description: res.description,
                              isCollectMoney: res.isCollectMoney,
                          }
                        : tgs;
                }),
            }));
        });

    const { isPending: isUpdating, mutateAsync: updateTargetShift } = useMutation<
        TargetShiftProps,
        Error,
        UpdateTargetShiftProps
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
            queryClient.setQueriesData({ queryKey }, (prev: TargetShiftProps) => {
                if (prev.id === res.id) return res;

                return prev;
            });

            updateTarget(res);
        },
    });

    return {
        updateTargetShift,

        isLoading: isUpdating,
    };
};

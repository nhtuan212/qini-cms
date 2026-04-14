import { useQuery } from "@tanstack/react-query";
import { fetchData } from "..";
import { URL } from "@/constants";
import { convertKeysToCamelCase } from "@/utils";
import { ShiftProps } from "@/types";

export const useShift = () => {
    const endpoint = URL.SHIFT;

    // GET
    const {
        isPending,
        isFetching,
        data: shifts = [],
    } = useQuery<ShiftProps[]>({
        queryKey: ["shift"],
        queryFn: () =>
            fetchData({
                endpoint,
            }).then(res => convertKeysToCamelCase(res.data)),
        staleTime: Infinity,
    });

    return { isPending, isFetching, shifts };
};

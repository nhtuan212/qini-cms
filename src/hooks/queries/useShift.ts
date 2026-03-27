import { useQuery } from "@tanstack/react-query";
import { fetchData } from "..";
import { URL } from "@/constants";
import { convertKeysToCamelCase } from "@/utils";

export const useShift = () => {
    const endpoint = URL.SHIFT;

    // GET
    const {
        isPending,
        isFetching,
        data: shifts = [],
    } = useQuery({
        queryKey: ["shift"],
        queryFn: () =>
            fetchData({
                endpoint,
            }).then(res => convertKeysToCamelCase(res.data)),
        staleTime: Infinity,
    });

    return { isPending, isFetching, shifts };
};

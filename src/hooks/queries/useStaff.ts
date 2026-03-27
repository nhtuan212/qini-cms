import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/hooks";
import { convertKeysToCamelCase } from "@/utils";
import { URL } from "@/constants";
import { StaffProps } from "@/types/staff";

export const useStaff = () => {
    const endpoint = URL.STAFF;

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

    return { staffs, isLoading: isPending || isFetching, isPending, isFetching };
};

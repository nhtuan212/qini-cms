import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "..";
import { camelCaseQueryString, convertKeysToCamelCase } from "@/utils";
import { CalendarDate } from "@internationalized/date";
import { URL } from "@/constants";
import { TargetProps, TimesheetData, TimesheetRecordProps } from "@/types";

interface useTimeSheetProps {
    startDate: string | CalendarDate;
    endDate?: string | CalendarDate;
}

type CreateTimeSheet = Pick<TimesheetData, "userId" | "shiftId" | "targetShiftId" | "checkIn">;

interface updateTimeSheetProps {
    id: TimesheetData["id"];
    params: Pick<TimesheetData, "checkOut" | "workingHours">;
}

export const useTimeSheet = (userId?: TimesheetData["userId"], params?: useTimeSheetProps) => {
    const queryClient = useQueryClient();
    const queryKey = ["timeSheet"];
    const endpoint = URL.TIME_SHEET;
    const queryString = params ? camelCaseQueryString(params) : "";

    const updateTarget = (res: TimesheetData) =>
        queryClient.setQueriesData({ queryKey: ["target"] }, (targets: TargetProps[]) => {
            return targets.map(target => ({
                ...target,
                targetShifts: target.targetShifts.map(targetShift => {
                    if (targetShift.id !== res.targetShiftId) return targetShift;

                    const isExistingTs = targetShift.timeSheets.some(ts => ts.id === res.id);

                    return {
                        ...targetShift,
                        timeSheets: isExistingTs
                            ? targetShift.timeSheets.map(ts => (ts.id === res.id ? res : ts)) // Update exist timesheet
                            : [...targetShift.timeSheets, res], // Create new timesheet
                    };
                }),
            }));
        });

    // Get timeSheets by employee
    const {
        isPending,
        isFetching,
        data: timeSheetRecords = {} as TimesheetRecordProps,
    } = useQuery<TimesheetRecordProps, Error, TimesheetRecordProps>({
        queryKey: [...queryKey, userId, params],
        queryFn: () =>
            fetchData({
                endpoint: `${endpoint}/user/${userId}${queryString}`,
            }).then(res => convertKeysToCamelCase(res)),
        enabled: !!userId, // fetch when has userId
        select: ({ name, salary, totalTarget, totalWorkingHours, data }) => ({
            name,
            salary,
            totalTarget,
            totalWorkingHours,
            data,
        }),
    });

    // Create timeSheet by employee
    const { isPending: isCreating, mutateAsync: createTimeSheet } = useMutation<
        TimesheetData,
        Error,
        CreateTimeSheet
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
            queryClient.setQueriesData({ queryKey }, (prev: TimesheetRecordProps) => ({
                ...prev,
                data: [...(prev?.data || []), res],
            }));

            updateTarget(res);
        },
    });

    // Update timeSheet by employee
    const { isPending: isUpdating, mutateAsync: updateTimeSheet } = useMutation<
        TimesheetData,
        Error,
        updateTimeSheetProps
    >({
        mutationFn: ({ id, params }: updateTimeSheetProps) =>
            fetchData({
                endpoint: `${endpoint}/${id}`,
                options: {
                    method: "PUT",
                    body: JSON.stringify(params),
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            // Match all queryKey is "timeSheet"
            queryClient.setQueriesData({ queryKey }, (prev: TimesheetRecordProps | undefined) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    data: prev.data.map(ts => (ts.id === res.id ? res : ts)),
                };
            });

            updateTarget(res);
        },
    });

    // Delete timeSheet by employee
    const { isPending: isDeleting, mutateAsync: deleteTimeSheet } = useMutation({
        mutationFn: (id: TimesheetData["id"]) =>
            fetchData({
                endpoint: `${endpoint}/${id}`,
                options: {
                    method: "DELETE",
                },
            }).then(res => convertKeysToCamelCase(res.data)),
        onSuccess: res => {
            queryClient.setQueriesData({ queryKey }, (prev: { data: TimesheetData[] }) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    data: prev.data.filter(old => old.id !== res.id),
                };
            });

            queryClient.setQueriesData({ queryKey: ["target"] }, (targets: TargetProps[]) =>
                targets.map(target => ({
                    ...target,
                    targetShifts: target.targetShifts.map(targetShift =>
                        targetShift.id === res.targetShiftId
                            ? {
                                  ...targetShift,
                                  timeSheets: targetShift.timeSheets.filter(ts => ts.id !== res.id),
                              }
                            : targetShift,
                    ),
                })),
            );
        },
    });

    return {
        isPending,
        isFetching,
        timeSheetRecords,

        isCreating,
        createTimeSheet,

        isUpdating,
        updateTimeSheet,

        isDeleting,
        deleteTimeSheet,

        isLoading: isPending || isFetching || isCreating || isUpdating || isDeleting,
    };
};

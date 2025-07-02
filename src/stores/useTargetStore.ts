import { create } from "zustand";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { TargetShiftProps } from "./useTargetShiftStore";
import { URL, STATUS_CODE } from "@/constants";
import { TimeSheetProps } from "./useTimeSheetStore";

export type TargetProps = {
    [key: string]: any;
};

type TargetState = {
    isLoading?: boolean;
    targets: TargetProps[];
    targetById: TargetProps;
    targetPagination?: {
        [key: string]: any;
    };
};

type TargetAction = {
    getTarget: (params?: string) => Promise<void>;
    getTargetById: (id: TargetProps["id"]) => Promise<TargetProps>;
    updateTarget: ({
        id,
        bodyParams,
    }: {
        id: TargetProps["id"];
        bodyParams: { [key: string]: any };
    }) => Promise<TargetProps>;
    createTarget: (bodyParams: TargetProps) => Promise<TargetProps>;
    deleteTarget: (id: TargetProps["id"]) => Promise<TargetProps>;
    emptyTargetById: () => void;

    updateTargetShiftInTargets: (updatedTargetShift: TargetShiftProps) => void;
    updateTimeSheetInTargets: (updatedTimeSheet: TimeSheetProps | TimeSheetProps[]) => void;
    removeTimeSheetFromTargets: (timeSheetId: string) => void;
};

const initialState: TargetState = {
    isLoading: false,
    targets: [],
    targetById: {} as TargetProps,
};

export const useTargetStore = create<TargetState & TargetAction>()(set => ({
    ...initialState,

    getTarget: async params => {
        set({
            isLoading: true,
        });

        const endpoint = `${URL.TARGET}${params ? params : ""}`;

        return await fetchData({
            endpoint,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                return set({
                    targets: res?.message,
                });
            }

            return set({
                targets: res.data.map((item: TargetProps) => convertKeysToCamelCase(item)),
                targetPagination: res.pagination,
            });
        });
    },

    getTargetById: async id => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.TARGET}/${id}`,
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== 200) {
                return set({
                    targetById: res?.message,
                });
            }

            set({
                targetById: convertKeysToCamelCase(res.data),
            });

            return res.data;
        });
    },

    createTarget: async (bodyParams: TargetProps) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.TARGET,
            options: {
                method: "POST",
                body: JSON.stringify(convertKeysToSnakeCase(bodyParams)),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                console.error("Error creating target", res);
                throw new Error(res);
            }

            set(state => ({
                targets: [convertKeysToCamelCase(res.data), ...state.targets],
            }));

            return convertKeysToCamelCase(res.data);
        });
    },

    updateTarget: async ({
        id,
        bodyParams,
    }: {
        id: TargetProps["id"];
        bodyParams: TargetProps;
    }) => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: `${URL.TARGET}/${id}`,
            options: {
                method: "PUT",
                body: JSON.stringify(convertKeysToSnakeCase(bodyParams)),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                return console.error("Error updating target", res);
            }

            const updatedTarget: TargetProps = convertKeysToCamelCase(res.data);

            const sum = (field: string) =>
                Array.isArray(updatedTarget.targetShift)
                    ? updatedTarget.targetShift.reduce(
                          (acc, shift) => acc + (Number(shift[field]) || 0),
                          0,
                      )
                    : 0;

            updatedTarget.revenue = sum("revenue");
            updatedTarget.transfer = sum("transfer");
            updatedTarget.deduction = sum("deduction");
            updatedTarget.cash = sum("cash");

            set(state => ({
                targets: state.targets.map((item: TargetProps) =>
                    item.id === id ? updatedTarget : item,
                ),
            }));

            return res;
        });
    },

    deleteTarget: async id => {
        set({
            isLoading: true,
        });

        return await fetchData({
            endpoint: URL.TARGET,
            options: {
                method: "DELETE",
                body: JSON.stringify({ id }),
            },
        }).then(res => {
            set({
                isLoading: false,
            });

            if (res?.code !== STATUS_CODE.OK) {
                return console.error("Error deleting target");
            }

            set(state => ({
                targets: state.targets.filter((item: TargetProps) => item.id !== id),
            }));

            return res;
        });
    },

    emptyTargetById: () => set({ targetById: {} }),

    updateTargetShiftInTargets: (updatedTargetShift: TargetShiftProps) =>
        set(state => ({
            targets: state.targets.map(target => ({
                ...target,
                targetShift: Array.isArray(target.targetShift)
                    ? target.targetShift.map(shift =>
                          shift.id === updatedTargetShift.id
                              ? { ...shift, ...updatedTargetShift }
                              : shift,
                      )
                    : target.targetShift,
            })),
        })),

    updateTimeSheetInTargets: (updatedTimeSheet: TimeSheetProps) =>
        set(state => ({
            targets: state.targets.map(target => ({
                ...target,
                targetShift: target.targetShift.map((shift: TargetShiftProps) => {
                    return shift.timeSheet.some(
                        (timeSheet: TimeSheetProps) => timeSheet.id === updatedTimeSheet.id,
                    )
                        ? {
                              ...shift,
                              timeSheet: shift.timeSheet.map((timeSheet: TimeSheetProps) =>
                                  timeSheet.id === updatedTimeSheet.id
                                      ? { ...timeSheet, ...updatedTimeSheet }
                                      : timeSheet,
                              ),
                          }
                        : shift;
                }),
            })),
        })),

    removeTimeSheetFromTargets: (timeSheetId: string) =>
        set(state => ({
            targets: state.targets.map(target => ({
                ...target,
                timeSheet: Array.isArray(target.timeSheet)
                    ? target.timeSheet.filter((ts: any) => ts.id !== timeSheetId)
                    : target.timeSheet,
                targetShift: Array.isArray(target.targetShift)
                    ? target.targetShift.map(shift => ({
                          ...shift,
                          timeSheet: Array.isArray(shift.timeSheet)
                              ? shift.timeSheet.filter((ts: any) => ts.id !== timeSheetId)
                              : shift.timeSheet,
                      }))
                    : target.targetShift,
            })),
        })),
}));

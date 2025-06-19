import { create } from "zustand";
import { convertKeysToCamelCase, convertKeysToSnakeCase, formatDate, formatTime } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { URL, STATUS_CODE, TEXT } from "@/constants";
import { useTargetStore } from "@/stores/useTargetStore";
import { ShiftProps, useShiftStore } from "./useShiftsStore";

export interface TimeSheetProps {
    [key: string]: any;
}

interface TimeSheetState {
    isLoading: boolean;
    timeSheets: TimeSheetProps[];
    timeSheetByStaffId: TimeSheetProps[];
    pagination?: {
        [key: string]: any;
    };
}

interface TimeSheetActions {
    recordTimeSheet: (params: { staffId: string; shiftId: string }) => Promise<TimeSheetProps>;
    getTimeSheet: (params?: { staffId?: string; date?: string }) => Promise<void>;
    updateTimeSheet: (params: {
        id: string;
        bodyParams: Partial<TimeSheetProps>;
    }) => Promise<TimeSheetProps>;
    deleteTimeSheet: (id: string) => Promise<void>;
    cleanUpTimeSheet: () => void;
}

const initialState: TimeSheetState = {
    isLoading: false,
    timeSheets: [],
    timeSheetByStaffId: [],
};

export const useTimeSheetStore = create<TimeSheetState & TimeSheetActions>()((set, get) => ({
    ...initialState,

    recordTimeSheet: async ({ staffId, shiftId }) => {
        set({ isLoading: true });

        const currentDate = formatDate(new Date(), "YYYY-MM-DD");

        const existingRecord = get().timeSheetByStaffId.find(
            record =>
                record.staffId === staffId &&
                record.shiftId === shiftId &&
                record.date &&
                formatDate(record.date, "YYYY-MM-DD") === currentDate,
        );

        if (existingRecord) {
            return get()
                .updateTimeSheet({
                    id: existingRecord.id!,
                    bodyParams: {
                        shiftId,
                        checkOut: formatTime(),
                    },
                })
                .then(res => {
                    set({ isLoading: false });

                    if (res?.code && res?.code !== STATUS_CODE.OK) {
                        throw new Error(res?.message || "Failed to update time sheet");
                    }

                    //** Update target */
                    const todayTarget = useTargetStore
                        .getState()
                        .targets.find(
                            target =>
                                target.targetAt &&
                                formatDate(target.targetAt, "YYYY-MM-DD") === currentDate,
                        );

                    if (!todayTarget) {
                        throw new Error("Target not found");
                    }

                    const updateTarget = {
                        name: todayTarget?.name,
                        targetAt: todayTarget?.targetAt,
                        targetShift: todayTarget?.targetShift.map((shiftItem: any) => {
                            if (shiftItem.shiftId === shiftId) {
                                return {
                                    ...shiftItem,
                                    targetStaff: shiftItem.targetStaff.map((staffItem: any) => {
                                        if (staffItem.staffId === staffId) {
                                            return {
                                                ...staffItem,
                                                checkOut: res.checkOut || formatTime(),
                                            };
                                        }
                                        return staffItem;
                                    }),
                                };
                            }
                            return shiftItem;
                        }),
                    };

                    useTargetStore.getState().updateTarget({
                        id: todayTarget.id,
                        bodyParams: updateTarget,
                    });

                    return res;
                });
        }

        const recordData = {
            staffId,
            shiftId,
            date: new Date().toISOString(),
            checkIn: formatTime(),
        };

        //** Create target */
        const shifts = useShiftStore.getState().shifts;

        const newTarget = {
            name: TEXT.TARGET,
            targetAt: currentDate,
            targetShift: shifts.map((shift: ShiftProps) => {
                if (shift.id === shiftId) {
                    return {
                        ...shift,
                        shift_id: shiftId,
                        target_staff: [
                            {
                                staff_id: staffId,
                                check_in: formatTime(),
                            },
                        ],
                    };
                }
                return {
                    ...shift,
                    shift_id: shift.id,
                    target_staff: [],
                };
            }),
        };
        useTargetStore.getState().createTarget(newTarget);

        //** Create time sheet */
        return await fetchData({
            endpoint: URL.TIME_SHEET,
            options: {
                method: "POST",
                body: JSON.stringify(convertKeysToSnakeCase(recordData)),
            },
        }).then(res => {
            set({ isLoading: false });

            if (res?.code !== STATUS_CODE.OK) {
                throw new Error(res?.message || "Record failed");
            }

            const newRecord = convertKeysToCamelCase(res.data);

            set(state => ({
                timeSheets: [newRecord, ...state.timeSheets],
                timeSheetByStaffId: [newRecord, ...state.timeSheetByStaffId],
            }));

            return newRecord;
        });
    },

    getTimeSheet: async params => {
        set({ isLoading: true });

        const queryParams = new URLSearchParams();
        if (params?.staffId) queryParams.append("staff_id", params.staffId);
        if (params?.date) queryParams.append("date", params.date);

        const endpoint = `${URL.TIME_SHEET}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

        return await fetchData({ endpoint }).then(res => {
            set({ isLoading: false });

            if (res?.code !== STATUS_CODE.OK) {
                return set({
                    timeSheets: [],
                });
            }

            if (params?.staffId) {
                const foundRecord: TimeSheetProps[] = res.data.filter((item: any) => {
                    const record = convertKeysToCamelCase(item) as TimeSheetProps;
                    return record.staffId === params.staffId;
                });

                return set({
                    timeSheetByStaffId: foundRecord.map(
                        item => convertKeysToCamelCase(item) as TimeSheetProps,
                    ),
                });
            }

            return set({
                timeSheets: res.data.map(
                    (item: any) => convertKeysToCamelCase(item) as TimeSheetProps,
                ),

                pagination: res.pagination,
            });
        });
    },

    updateTimeSheet: async ({ id, bodyParams }) => {
        set({ isLoading: true });

        return await fetchData({
            endpoint: `${URL.TIME_SHEET}/${id}`,
            options: {
                method: "PUT",
                body: JSON.stringify(convertKeysToSnakeCase(bodyParams)),
            },
        }).then(rs => {
            set({ isLoading: false });

            if (rs?.code !== STATUS_CODE.OK) {
                throw new Error(rs?.message || "Failed to update time sheet");
            }

            const updatedRecord = convertKeysToCamelCase(rs.data) as TimeSheetProps;

            set(state => ({
                timeSheetByStaffId: state.timeSheetByStaffId.map(item =>
                    item.id === updatedRecord.id ? updatedRecord : item,
                ),
            }));

            return updatedRecord;
        });
    },

    deleteTimeSheet: async id => {
        set({ isLoading: true });

        return await fetchData({
            endpoint: `${URL.TIME_SHEET}/${id}`,
            options: {
                method: "DELETE",
            },
        }).then(rs => {
            set({ isLoading: false });

            if (rs?.code !== STATUS_CODE.OK) {
                throw new Error(rs?.message || "Failed to delete time sheet");
            }

            set(state => ({
                timeSheets: state.timeSheets.filter(record => record.id !== id),
            }));
        });
    },

    cleanUpTimeSheet: () => {
        set({ timeSheetByStaffId: initialState.timeSheetByStaffId });
    },
}));

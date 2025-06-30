import { create } from "zustand";
import { useTargetStore } from "./useTargetStore";
import {
    calculateWorkingHours,
    convertKeysToCamelCase,
    convertKeysToSnakeCase,
    formatDate,
    formatTime,
} from "@/utils";
import { fetchData } from "@/utils/fetch";
import { URL, STATUS_CODE } from "@/constants";

export interface TimeSheetProps {
    [key: string]: any;
}

interface TimeSheetState {
    isLoading: boolean;
    timeSheets: {
        data: TimeSheetProps[];
        totalWorkingHours: number;
        pagination: {
            total: number;
            page: number;
            limit: number;
        };
    };
    timeSheetByStaffId: {
        data: TimeSheetProps[];
        totalWorkingHours: number;
        pagination: {
            total: number;
            page: number;
            limit: number;
        };
    };
    pagination?: {
        [key: string]: any;
    };
}

interface TimeSheetActions {
    recordTimeSheet: (params: {
        staffId: string;
        shiftId: string;
        targetShiftId: string;
    }) => Promise<void>;
    getTimeSheet: (params?: {
        staffId?: string;
        startDate?: string;
        endDate?: string;
    }) => Promise<void>;
    createTimeSheet: (
        params: TimeSheetProps | TimeSheetProps[],
    ) => Promise<TimeSheetProps | TimeSheetProps[]>;
    updateTimeSheet: (params: {
        id: string;
        bodyParams: Partial<TimeSheetProps>;
    }) => Promise<TimeSheetProps>;
    deleteTimeSheet: (id: string) => Promise<void>;
    cleanUpTimeSheet: () => void;
}

const initialState: TimeSheetState = {
    isLoading: false,
    timeSheets: {
        data: [],
        totalWorkingHours: 0,
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
        },
    },
    timeSheetByStaffId: {
        data: [],
        totalWorkingHours: 0,
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
        },
    },
};

export const useTimeSheetStore = create<TimeSheetState & TimeSheetActions>()((set, get) => ({
    ...initialState,

    recordTimeSheet: async ({ staffId, shiftId, targetShiftId }) => {
        set({ isLoading: true });

        const currentDate = formatDate(new Date(), "YYYY-MM-DD");
        const timeSheets = get().timeSheetByStaffId.data;

        const currentTimeSheet = timeSheets.find(
            record =>
                record.staffId === staffId &&
                record.shiftId === shiftId &&
                record.targetShiftId === targetShiftId &&
                formatDate(record.date, "YYYY-MM-DD") === currentDate,
        );

        const handleTarget = currentTimeSheet
            ? get().updateTimeSheet({
                  id: currentTimeSheet.id,
                  bodyParams: {
                      checkOut: formatTime(),
                      workingHours: calculateWorkingHours(currentTimeSheet.checkIn, formatTime()),
                  },
              })
            : get().createTimeSheet({ staffId, shiftId, targetShiftId });

        return await handleTarget.then(() => {
            return set({ isLoading: false });
        });
    },

    getTimeSheet: async params => {
        set({ isLoading: true });

        const queryParams = new URLSearchParams();
        if (params?.staffId) queryParams.append("staff_id", params.staffId);
        if (params?.startDate) queryParams.append("start_date", params.startDate);
        if (params?.endDate) queryParams.append("end_date", params.endDate);

        const endpoint = `${URL.TIME_SHEET}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

        return await fetchData({ endpoint }).then(res => {
            set({ isLoading: false });

            const data = res.data.map((item: TimeSheetProps) => convertKeysToCamelCase(item));

            if (res?.code !== STATUS_CODE.OK) {
                return set({
                    timeSheets: initialState.timeSheets,
                });
            }

            if (params?.staffId) {
                const foundRecord: TimeSheetProps[] = data.filter((item: any) => {
                    const record = convertKeysToCamelCase(item) as TimeSheetProps;
                    return record.staffId === params.staffId;
                });

                return set({
                    timeSheetByStaffId: {
                        data: foundRecord,
                        totalWorkingHours: res.total_working_hours,
                        pagination: res.pagination,
                    },
                });
            }

            return set({
                timeSheets: {
                    data,
                    totalWorkingHours: res.total_working_hours,
                    pagination: res.pagination,
                },
            });
        });
    },

    createTimeSheet: async (params: TimeSheetProps | TimeSheetProps[]) => {
        const recordData = Array.isArray(params)
            ? params
            : {
                  staffId: params.staffId,
                  shiftId: params.shiftId,
                  targetShiftId: params.targetShiftId,
                  checkIn: params.checkIn || formatTime(),
              };

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
                timeSheets: {
                    data: [...state.timeSheets.data, newRecord],
                    totalWorkingHours: state.timeSheets.totalWorkingHours + res.total_working_hours,
                    pagination: state.timeSheets.pagination,
                },

                timeSheetByStaffId: {
                    data: [...state.timeSheetByStaffId.data, newRecord],
                    totalWorkingHours:
                        state.timeSheetByStaffId.totalWorkingHours + res.total_working_hours,
                    pagination: state.timeSheetByStaffId.pagination,
                },
            }));

            useTargetStore.getState().updateTimeSheetInTargets(newRecord);

            return Array.isArray(params) ? convertKeysToCamelCase(res.data) : newRecord;
        });
    },

    updateTimeSheet: async ({ id, bodyParams }: { id: string; bodyParams: TimeSheetProps }) => {
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
                timeSheetByStaffId: {
                    data: state.timeSheetByStaffId.data.map(item =>
                        item.id === updatedRecord.id ? updatedRecord : item,
                    ),
                    totalWorkingHours: state.timeSheetByStaffId.totalWorkingHours,
                    pagination: state.timeSheetByStaffId.pagination,
                },
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
        }).then(res => {
            set({ isLoading: false });

            if (res?.code !== STATUS_CODE.OK) {
                throw new Error(res?.message || "Failed to delete time sheet");
            }

            set(state => ({
                timeSheets: {
                    data: state.timeSheets.data.filter(record => record.id !== id),
                    totalWorkingHours: state.timeSheets.totalWorkingHours - res.working_hours,
                    pagination: state.timeSheets.pagination,
                },

                timeSheetByStaffId: {
                    data: state.timeSheetByStaffId.data.filter(record => record.id !== id),
                    totalWorkingHours: state.timeSheetByStaffId.totalWorkingHours,
                    pagination: state.timeSheetByStaffId.pagination,
                },
            }));

            const data = convertKeysToCamelCase(res.data) as TimeSheetProps;

            useTargetStore.getState().removeTimeSheetFromTargets(data.id);
        });
    },

    cleanUpTimeSheet: () => {
        set({ timeSheetByStaffId: initialState.timeSheetByStaffId });
    },
}));

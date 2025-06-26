import { create } from "zustand";
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
    timeSheets: TimeSheetProps[];
    timeSheetByStaffId: TimeSheetProps[];
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
    createTimeSheet: (params: {
        staffId: string;
        shiftId?: string;
        targetShiftId?: string;
    }) => Promise<TimeSheetProps>;
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

    recordTimeSheet: async ({ staffId, shiftId, targetShiftId }) => {
        set({ isLoading: true });

        const currentDate = formatDate(new Date(), "YYYY-MM-DD");
        const timeSheets = get().timeSheetByStaffId;

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

    createTimeSheet: async ({ staffId, shiftId, targetShiftId }: TimeSheetProps) => {
        const recordData = {
            staffId,
            shiftId,
            targetShiftId,
            checkIn: formatTime(),
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

            const newRecord = {
                ...convertKeysToCamelCase(res.data),
            };

            set(state => ({
                timeSheets: [...state.timeSheets, newRecord],
                timeSheetByStaffId: [...state.timeSheetByStaffId, newRecord],
            }));

            return newRecord;
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
                timeSheetByStaffId: state.timeSheetByStaffId.filter(record => record.id !== id),
            }));
        });
    },

    cleanUpTimeSheet: () => {
        set({ timeSheetByStaffId: initialState.timeSheetByStaffId });
    },
}));

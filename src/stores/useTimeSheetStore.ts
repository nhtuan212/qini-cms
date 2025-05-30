import { create } from "zustand";
import { convertKeysToCamelCase, convertKeysToSnakeCase, formatTime } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { URL, STATUS_CODE } from "@/constants";

export interface TimeSheetRecord {
    id?: string;
    staffId?: string;
    date?: string;
    checkIn?: string;
    checkOut?: string;
    workingHours?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface TimeSheetState {
    isLoading: boolean;
    timeSheets: TimeSheetRecord[];
    timeSheetByStaffId: TimeSheetRecord;
    pagination?: {
        [key: string]: any;
    };
}

interface TimeSheetActions {
    recordTimeSheet: (params: { staffId: string }) => Promise<TimeSheetRecord>;
    getTimeSheet: (params?: { staffId?: string; date?: string }) => Promise<void>;
    updateTimeSheet: (params: {
        id: string;
        bodyParams: Partial<TimeSheetRecord>;
    }) => Promise<TimeSheetRecord>;
    deleteTimeSheet: (id: string) => Promise<void>;
    cleanUpTimeSheet: () => void;
}

const initialState: TimeSheetState = {
    isLoading: false,
    timeSheets: [],
    timeSheetByStaffId: {
        checkIn: "N/A",
        checkOut: "N/A",
        workingHours: "0",
    },
};

export const useTimeSheetStore = create<TimeSheetState & TimeSheetActions>()((set, get) => ({
    ...initialState,

    // Record time sheet - handles both first click (POST) and subsequent clicks (PUT)
    recordTimeSheet: async ({ staffId }) => {
        set({ isLoading: true });

        const currentDate = new Date().toISOString().split("T")[0];

        // First, fetch current records from server to handle page refresh
        return await fetchData({
            endpoint: `${URL.TIME_SHEET}?staffId=${staffId}&date=${currentDate}`,
        }).then(async serverResponse => {
            // Check if record exists on server for today
            const existingRecord = serverResponse?.data?.find(
                (record: any) =>
                    new Date(record.date).toISOString().split("T")[0] === currentDate &&
                    record.staff_id === staffId,
            );

            // If record exists on server, update it (subsequent click)
            if (existingRecord?.id) {
                return await get().updateTimeSheet({
                    id: existingRecord.id,
                    bodyParams: {
                        checkOut: formatTime(),
                    },
                });
            }

            // If no record exists, create new one (first click)
            const recordData = {
                staffId,
                date: new Date().toISOString(),
                checkIn: formatTime(),
            };

            return await fetchData({
                endpoint: URL.TIME_SHEET,
                options: {
                    method: "POST",
                    body: JSON.stringify(convertKeysToSnakeCase(recordData)),
                },
            }).then(rs => {
                set({ isLoading: false });

                if (rs?.code !== STATUS_CODE.OK) {
                    throw new Error(rs?.message || "Record failed");
                }

                const newRecord = convertKeysToCamelCase(rs.data) as TimeSheetRecord;

                set(state => ({
                    timeSheets: [newRecord, ...state.timeSheets],
                    timeSheetByStaffId: newRecord,
                }));

                return newRecord;
            });
        });
    },

    // Get time sheets - all or filtered by staffId/date
    getTimeSheet: async params => {
        set({ isLoading: true });

        const queryParams = new URLSearchParams();
        if (params?.staffId) queryParams.append("staffId", params.staffId);
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
                const foundRecord = res.data.find((item: TimeSheetRecord) => {
                    const record = convertKeysToCamelCase(item) as TimeSheetRecord;
                    const recordDate = new Date(record.date || "").toISOString().split("T")[0];
                    const targetDate = params.date || new Date().toISOString().split("T")[0];

                    return record.staffId === params.staffId && recordDate === targetDate;
                });

                return set({
                    timeSheetByStaffId: foundRecord
                        ? (convertKeysToCamelCase(foundRecord) as TimeSheetRecord)
                        : initialState.timeSheetByStaffId,
                });
            }

            return set({
                timeSheets: res.data.map(
                    (item: any) => convertKeysToCamelCase(item) as TimeSheetRecord,
                ),
                pagination: res.pagination,
            });
        });
    },

    // Update time sheet record
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

            const updatedRecord = convertKeysToCamelCase(rs.data) as TimeSheetRecord;

            set(state => ({
                timeSheets: state.timeSheets.map(record =>
                    record.id === id ? updatedRecord : record,
                ),
                timeSheetByStaffId: updatedRecord,
            }));

            return updatedRecord;
        });
    },

    // Delete time sheet record
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

    // Clean up time sheet by staff id
    cleanUpTimeSheet: () => {
        set({ timeSheetByStaffId: initialState.timeSheetByStaffId });
    },
}));

import { create } from "zustand";
import { convertKeysToCamelCase } from "@/utils";
import { fetchData } from "@/utils/fetch";
import { STATUS_CODE, URL } from "@/constants";
import { useWorkTypeStore } from "./useWorkTypeStore";
import { useStaffStore } from "./useStaffStore";

export type WorkAssignmentProps = {
    [key: string]: any;
};

type WorkAssignmentAction = {
    getWorkAssignments: () => Promise<void>;
    getWorkAssignmentById: (id: string) => Promise<WorkAssignmentProps>;
    createWorkAssignment: (data: WorkAssignmentProps) => Promise<WorkAssignmentProps>;
    updateWorkAssignment: (id: string, data: WorkAssignmentProps) => Promise<WorkAssignmentProps>;
    deleteWorkAssignment: (id: string) => Promise<WorkAssignmentProps>;
    resetWorkAssignmentById: () => void;
};

type WorkAssignmentState = {
    isLoading: boolean;
    workAssignments: WorkAssignmentProps[];
    workAssignmentById: WorkAssignmentProps;
};

const initialState: WorkAssignmentState = {
    isLoading: false,
    workAssignments: [],
    workAssignmentById: {},
};

export const useWorkAssignmentStore = create<WorkAssignmentState & WorkAssignmentAction>()(
    (set, get) => ({
        ...initialState,

        // Actions

        getWorkAssignments: async () => {
            set({
                isLoading: true,
            });

            return await fetchData({
                endpoint: URL.WORK_ASSIGNMENT,
            }).then(res => {
                set({
                    isLoading: false,
                });

                if (res?.code !== STATUS_CODE.OK) {
                    throw new Error(res?.message);
                }

                return set({
                    workAssignments: res.data.map((item: WorkAssignmentProps) =>
                        convertKeysToCamelCase(item),
                    ),
                });
            });
        },

        getWorkAssignmentById: async (id: string) => {
            set({
                isLoading: true,
            });

            return await fetchData({
                endpoint: `${URL.WORK_ASSIGNMENT}/${id}`,
            }).then(res => {
                set({
                    isLoading: false,
                });

                if (res?.code !== STATUS_CODE.OK) {
                    throw new Error(res?.message);
                }

                set({
                    workAssignmentById: convertKeysToCamelCase(res.data),
                });

                return convertKeysToCamelCase(res.data);
            });
        },

        createWorkAssignment: async (data: WorkAssignmentProps) => {
            set({
                isLoading: true,
            });

            return await fetchData({
                endpoint: URL.WORK_ASSIGNMENT,
                options: { method: "POST", body: JSON.stringify(data) },
            }).then(res => {
                set({
                    isLoading: false,
                });

                if (res?.code !== STATUS_CODE.OK) {
                    throw new Error(res?.message);
                }

                // Get work types and staff data from their respective stores
                const workTypeStore = useWorkTypeStore.getState();
                const staffStore = useStaffStore.getState();

                set(state => ({
                    workAssignments: [
                        ...state.workAssignments,
                        ...res.data.map((item: WorkAssignmentProps) => {
                            // Find work type name
                            const workTypeName =
                                workTypeStore.workTypes.find(
                                    workType => workType.id === item.workTypeId,
                                )?.name || "";

                            // Find staff name
                            const staffName =
                                staffStore.staff.find(
                                    staffMember => staffMember.id === item.staffId,
                                )?.name || "";

                            return convertKeysToCamelCase({
                                ...item,
                                workTypeName,
                                staffName,
                            });
                        }),
                    ],
                }));

                return convertKeysToCamelCase(res.data);
            });
        },

        updateWorkAssignment: async (id: string, data: WorkAssignmentProps) => {
            set({
                isLoading: true,
            });

            return await fetchData({
                endpoint: `${URL.WORK_ASSIGNMENT}/${id}`,
                options: { method: "PUT", body: JSON.stringify(data) },
            }).then(res => {
                set({
                    isLoading: false,
                });

                if (res?.code !== STATUS_CODE.OK) {
                    throw new Error(res?.message);
                }

                set(() => ({
                    workAssignments: get().workAssignments.map(workAssignment =>
                        workAssignment.id === id
                            ? res.data.find((item: WorkAssignmentProps) =>
                                  convertKeysToCamelCase(item),
                              )
                            : workAssignment,
                    ),
                }));

                return convertKeysToCamelCase(res.data);
            });
        },

        deleteWorkAssignment: async (id: string) => {
            set({
                isLoading: true,
            });

            return await fetchData({
                endpoint: `${URL.WORK_ASSIGNMENT}/${id}`,
                options: { method: "DELETE" },
            }).then(res => {
                set({
                    isLoading: false,
                });

                if (res?.code !== STATUS_CODE.OK) {
                    throw new Error(res?.message);
                }

                set(state => ({
                    workAssignments: state.workAssignments.filter(
                        workAssignment => workAssignment.id !== id,
                    ),
                }));

                return convertKeysToCamelCase(res.data);
            });
        },

        resetWorkAssignmentById: () => {
            set({
                workAssignmentById: {},
            });
        },
    }),
);

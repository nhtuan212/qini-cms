import { create } from "zustand";
import { TargetShiftProps } from "./useTargetShiftStore";
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

    updateTargetShiftInTargets: (updatedTargetShift: TargetShiftProps) =>
        set(state => ({
            targets: state.targets.map(target => ({
                ...target,
                targetShifts: Array.isArray(target.targetShifts)
                    ? target.targetShifts.map(shift =>
                          shift.id === updatedTargetShift.id
                              ? { ...shift, ...updatedTargetShift }
                              : shift,
                      )
                    : target.targetShifts,
            })),
        })),

    updateTimeSheetInTargets: (updatedTimeSheet: TimeSheetProps) =>
        set(state => ({
            targets: state.targets.map(target => ({
                ...target,
                targetShifts: target.targetShifts.map((shift: TargetShiftProps) =>
                    Array.isArray(updatedTimeSheet)
                        ? updatedTimeSheet.some(
                              (timeSheet: TimeSheetProps) => timeSheet.targetShiftId === shift.id,
                          )
                            ? { ...shift, timeSheets: [...shift.timeSheets, ...updatedTimeSheet] }
                            : shift
                        : shift.timeSheets.some(
                                (timeSheet: TimeSheetProps) => timeSheet.id === updatedTimeSheet.id,
                            )
                          ? {
                                ...shift,
                                timeSheets: shift.timeSheets.map((timeSheet: TimeSheetProps) =>
                                    timeSheet.id === updatedTimeSheet.id
                                        ? { ...timeSheet, ...updatedTimeSheet }
                                        : timeSheet,
                                ),
                            }
                          : shift,
                ),
            })),
        })),

    removeTimeSheetFromTargets: (timeSheetId: string) =>
        set(state => ({
            targets: state.targets.map((target: TargetProps) => ({
                ...target,
                timeSheets: Array.isArray(target.timeSheets)
                    ? target.timeSheets.filter((ts: any) => ts.id !== timeSheetId)
                    : target.timeSheets,
                targetShifts: Array.isArray(target.targetShifts)
                    ? target.targetShifts.map(shift => ({
                          ...shift,
                          timeSheets: Array.isArray(shift.timeSheets)
                              ? shift.timeSheets.filter((ts: any) => ts.id !== timeSheetId)
                              : shift.timeSheets,
                      }))
                    : target.targetShifts,
            })),
        })),
}));

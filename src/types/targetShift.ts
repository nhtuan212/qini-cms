import { TimesheetData } from "./timeSheet";

export interface TargetShiftProps {
    id: string;
    shiftId: string;
    revenue: number;
    cash: number;
    transfer: number;
    point: number;
    deduction: number;
    description: string;
    shiftName: string;
    startTime: string;
    endTime: string;
    kiotId: string | null;
    isTarget: boolean;
    timeSheets: TimesheetData[];
}

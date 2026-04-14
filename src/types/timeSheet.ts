export interface TimesheetData {
    id: string;
    staffId: string;
    shiftId: string;
    staffName: string;
    targetShiftId: string;
    shiftName: string;
    date: string; // "YYYY-MM-DD"
    checkIn: string; // "HH:mm" | ""
    checkOut: string; // "HH:mm" | ""
    workingHours: number;
    target: number;
}

export interface TimesheetRecordProps {
    staffName: string;
    salary: number;
    totalWorkingHours: number;
    totalTarget: number;
    data: TimesheetData[];
}

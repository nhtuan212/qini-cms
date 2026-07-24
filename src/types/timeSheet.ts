export interface TimesheetData {
    id: string;
    userId: string;
    shiftId: string;
    name: string;
    targetShiftId: string;
    shiftName: string;
    date: string; // "YYYY-MM-DD"
    checkIn: string; // "HH:mm" | ""
    checkOut: string; // "HH:mm" | ""
    workingHours: number;
    target: number;
}

export interface TimesheetRecordProps {
    name: string;
    salary: number;
    totalWorkingHours: number;
    totalTarget: number;
    data: TimesheetData[];
}

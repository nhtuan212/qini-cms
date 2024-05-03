import { reportDetail } from "@/types/reportProps";

export type ReportByStaff = {
    id: string;
    staffId?: string;
    staffName?: string;
    totalTarget?: number;
    totalTime?: number;
    performance?: number;
    total?: number;
    rank?: string;
    rate?: number;
};

export type ReportDetailProps = {
    id?: string;
    checkIn?: string;
    checkOut?: string;
    staffId?: string;
    staffName?: string;
    target?: number;
    timeWorked?: number;
    createAt?: Date;
};

export const ReportDetailModel = (data: reportDetail): ReportDetailProps => {
    return {
        id: data.id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        staffId: data.staffId,
        staffName: data.staff?.name,
        target: data.target,
        timeWorked: data.timeWorked,
        createAt: data.createAt,
    };
};

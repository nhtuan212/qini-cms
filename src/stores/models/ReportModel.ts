import { reportByRevenue, salaryByStaff } from "@/types/reportProps";

export type SalaryReportProps = {
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

export const SalaryReportModel = (data: salaryByStaff): SalaryReportProps => {
    return {
        id: data.id,
        staffId: data.staffId,
        staffName: data.staffName,
        performance: data.performance,
        total: data.total,
        rank: data.rank,
        rate: data.rate,
        totalTarget: data._sum.target,
        totalTime: data._sum.timeWorked,
    };
};

export type RevenueReportProps = {
    id?: string;
    checkIn?: string;
    checkOut?: string;
    staffId?: string;
    staffName?: string;
    target?: number;
    timeWorked?: number;
    createAt?: Date;
};

export const RevenueReportModel = (data: reportByRevenue): RevenueReportProps => {
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

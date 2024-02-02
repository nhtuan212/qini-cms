export type ReportProps = {
    id: string;
    revenueId: string;
    checkIn: string;
    checkOut: string;
    target: number;
    createAt: Date;
    updateAt: Date;
    timeWorked: number;
    staffId: string;
    revenue: number;
};

export type ReportParams = {
    startDate: string;
    endDate: string;
};

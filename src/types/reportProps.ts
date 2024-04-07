export type ReportProps = {
    totalTarget: number;
    totalTime: number;
    startDate?: string;
    endDate?: string;
    reports: [
        {
            id?: string;
            revenueId?: string;
            checkIn?: string;
            checkOut?: string;
            target?: number;
            createAt?: Date;
            updateAt?: Date;
            timeWorked?: number;
            staffId?: string;
            revenue?: number;
        },
    ];
};

export type salaryByStaff = {
    id: string;
    staffId: string;
    staffName: string;
    rank: string;
    rate: number;
    totalTarget: number;
    totalTime: number;
    total: number;
    performance: number;
    _sum: {
        target: number;
        timeWorked: number;
    };
};

export type reportByRevenue = {
    id?: string;
    checkIn?: string;
    checkOut?: string;
    staff?: {
        name?: string;
    };
    staffId?: string;
    target?: number;
    timeWorked?: number;
    createAt?: Date;
};

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

export type reportDetail = {
    id?: string;
    createAt?: Date;
    revenue?: number;
    isApproved?: boolean;

    reportsOnStaffs?: [
        {
            checkIn?: string;
            checkOut?: string;
            staff?: {
                name?: string;
            };
            staffId?: string;
            target?: number;
            timeWorked?: number;
        },
    ];
    shift?: {
        name?: string;
    };
};

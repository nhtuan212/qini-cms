export type ReportProps = {
    id?: string;
    createAt?: Date | string;
    revenue?: number;
    description?: string;
    isApproved?: boolean;
    shiftId?: string;

    shift?: {
        name?: string;
    };
};

export type reportsOnStaffsProps = {
    staffId?: string;
    checkIn?: string;
    checkOut?: string;
    timeWorked?: number;
    target?: number;
}[];

export type ReportDetailProps = {
    id: string;
    createAt?: Date | string;
    revenue?: number;
    description?: string;
    isApproved?: boolean;
    shiftId?: string;

    reportsOnStaffs: [
        {
            checkIn?: string;
            checkOut?: string;
            staff?: {
                id?: string;
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

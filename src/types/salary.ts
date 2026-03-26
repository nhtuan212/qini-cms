export interface SalaryProps {
    id: string;
    staffName: string;
    name: string;
    salary: number;
    salaryType: "HOURLY" | "MONTHLY";
    workingHours: number;
    target: number;
    bonus: number;
    workingMonth: number;
    workingDay: number;
    lunchAllowancePerDay: number;
    gasolineAllowancePerDay: number;
    paidLeave: number;
    description: string;
    startDate: string;
    endDate: string;
    total: number;
}

export interface SalaryParams {
    staffId?: number;
    startDate?: string | null;
    endDate?: string | null;
}

export type CreateSalaryProps = Omit<SalaryProps, "id" | "staffName" | "salaryType" | "total">;

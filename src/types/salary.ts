import { SalaryTypeProps } from ".";

export interface SalaryProps {
    id: string;
    staffName: string;
    name: string;
    salary: number;
    salaryType: SalaryTypeProps;
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

export interface SalaryListProps {
    salaries: SalaryProps[];
    totalAmount: number;
    startDate?: string;
    endDate?: string;
}

export interface SalaryPeriodProps {
    startDate?: string;
    endDate?: string;
}

export interface SalaryParams {
    staffId?: string;
    startDate?: string | null;
    endDate?: string | null;
}

export type CreateSalaryProps = Omit<SalaryProps, "id" | "staffName" | "salaryType" | "total">;

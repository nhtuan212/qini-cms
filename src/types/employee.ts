export interface EmployeeProps {
    id: string;
    userId: string;
    name: string;
    password: string;
    salary: number;
    salaryType: "HOURLY" | "MONTHLY";
    isTarget: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

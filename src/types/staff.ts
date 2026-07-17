export interface StaffProps {
    id: string;
    userId: string;
    name: string;
    salary: number;
    salaryType: "HOURLY" | "MONTHLY";
    isTarget: boolean;
    isActive: boolean;
    isFirstLogin: boolean;
    password: string;
    createdAt: string;
    updatedAt: string;
}

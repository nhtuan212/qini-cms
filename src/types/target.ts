import { TargetShiftProps } from "./targetShift";

export interface TargetProps {
    id: string;
    name: string;
    targetAt: string;
    createdAt: string;
    updatedAt: string | null;
    revenue: number;
    cash: number;
    transfer: number;
    deduction: number;
    point: number;
    targetShifts: TargetShiftProps[];
}

import { TargetShiftProps } from "./targetShift";

export interface TargetProps {
    id: string;
    name: string;
    targetAt: string;
    revenue: number;
    transfer: number;
    cash: number;
    point: number;
    targetShifts: TargetShiftProps[];
    createdAt: string;
    updatedAt: string | null;
}

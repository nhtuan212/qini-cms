export interface ShiftProps {
    id: string;
    kiotId: string | null;
    name: string;
    startTime: string;
    endTime: string;
    isTarget: boolean;
    createdAt: string;
    updatedAt: string | null;
}

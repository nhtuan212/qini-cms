export interface LocationProps {
    id: string;
    name: string;
    lat: number;
    lng: number;
    radius: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

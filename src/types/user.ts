export interface UserProps {
    id: string;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    isFirstLogin: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

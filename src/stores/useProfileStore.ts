import { ProfileProps } from "@/types/profileProps";
import { create } from "zustand";

interface ProfileState {
    profile: ProfileProps["user"];
    getProfile: (session: ProfileProps) => void;
}

export const useProfileStore = create<ProfileState>()(set => ({
    profile: {
        username: "",
        email: "",
        role: "",
    },
    getProfile: session =>
        set(() => ({
            profile: {
                username: session?.user?.username || "bin",
                email: session?.user?.email,
                role: session?.user?.role,
            },
        })),
}));

/**
 * use devtools(persist(...)) if want to handle with local storage
 * yarn add @redux-devtools/extension --dev // required for devtools typing
 * import type {} from "@redux-devtools/extension";
 */

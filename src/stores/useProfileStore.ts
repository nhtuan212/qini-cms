import { create } from "zustand";
import { Session } from "next-auth";

export type ProfileProps = {
    [key: string]: any;
};

type ProfileState = {
    profile: ProfileProps;
};

type ProfileAction = {
    getProfile: (session: Session) => void;
};

const initialState: ProfileState = {
    profile: {},
};

export const useProfileStore = create<ProfileState & ProfileAction>()(set => ({
    ...initialState,

    getProfile: session =>
        set(() => ({
            profile: {
                ...session.user,
            },
        })),
}));

/**
 * use devtools(persist(...)) if want to handle with local storage
 * yarn add @redux-devtools/extension --dev // required for devtools typing
 * import type {} from "@redux-devtools/extension";
 */

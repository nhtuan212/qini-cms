import { create } from "zustand";
import { DrawerProps } from "@heroui/react";

type UseDrawerProps = {
    drawerHeader?: React.ReactNode;
    drawerBody?: React.ReactNode;
    drawerFooter?: React.ReactNode;
} & Omit<DrawerProps, "children">;

type DrawerState = {
    drawer: UseDrawerProps;
};

type DrawerAction = {
    getDrawer: ({ ...props }: UseDrawerProps) => Promise<void>;
};

const initialState: DrawerState = {
    drawer: {
        isOpen: false,
        size: "md",
        isDismissable: true,
        onClose: () => {},
    },
};

export const useDrawerStore = create<DrawerState & DrawerAction>()((set, get) => ({
    ...initialState,

    getDrawer: async ({ ...props }) => {
        return set(() => ({
            drawer: {
                size: get().drawer.isOpen ? get().drawer.size : initialState.drawer.size,
                ...initialState.drawer,
                ...props,
            },
        }));
    },
}));

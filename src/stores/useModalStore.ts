import { create } from "zustand";
import { ModalProps } from "@heroui/react";
import { ModalActionProps } from "@/lib/types";

type UseModalProps = {
    action?: ModalActionProps;
    modalHeader?: React.ReactNode;
    modalBody?: React.ReactNode;
    modalFooter?: React.ReactNode;
} & Omit<ModalProps, "children">;

type ModalState = {
    modal: UseModalProps;
};

type ModalAction = {
    getModal: ({ ...props }: UseModalProps) => Promise<void>;
};

const initialState: ModalState = {
    modal: {
        isOpen: false,
        action: ModalActionProps.CREATE,
    },
};

export const useModalStore = create<ModalState & ModalAction>()((set, get) => ({
    ...initialState,

    getModal: async ({ ...props }) => {
        return set(() => ({
            modal: {
                size: get().modal.isOpen ? get().modal.size : initialState.modal.size,
                ...initialState.modal,
                ...props,
            },
        }));
    },
}));

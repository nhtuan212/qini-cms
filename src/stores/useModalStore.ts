import { create } from "zustand";
import { MODAL } from "@/constants";

type ModalProps = {
    modalName: string;
    modalAction?: string;
    modalMessage: string;
    onConfirm: () => void;
    onCancel: () => void;
};

type ModalAction = {
    openModal: (modalName: string, modalAction?: string) => Promise<any>;
    openConfirmModal: ({ modalMessage, onConfirm, onCancel }: ModalProps) => Promise<any>;
};

const initialState: ModalProps = {
    modalName: "",
    modalAction: "add",
    modalMessage: "",
    onConfirm: () => {},
    onCancel: () => {},
};

export const useModalStore = create<ModalProps & ModalAction>()(set => ({
    ...initialState,

    openModal: async (modalName, modalAction) =>
        set(() => ({ modalName, modalAction: modalAction || "add" })),

    openConfirmModal: async ({ modalMessage, onConfirm, onCancel }) =>
        set(() => ({ modalName: MODAL.CONFIRM, modalMessage, onConfirm, onCancel })),
}));

import { create } from "zustand";

type ModalState = {
    modalName: string;
    modalAction: string;
};

type ModalAction = {
    openModal: (modalName: string, modalAction?: string) => void;
};

const initialState: ModalState = {
    modalName: "",
    modalAction: "add",
};

export const useModalStore = create<ModalState & ModalAction>()(set => ({
    ...initialState,

    openModal: (modalName, modalAction) =>
        set(() => ({ modalName, modalAction: modalAction || "add" })),
}));

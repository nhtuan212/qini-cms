import { create } from "zustand";

type ModalState = {
    modalName: string;
    modalAction: string;
};

type ModalAction = {
    openModal: (modalName: string, modalAction?: string) => Promise<any>;
};

const initialState: ModalState = {
    modalName: "",
    modalAction: "add",
};

export const useModalStore = create<ModalState & ModalAction>()(set => ({
    ...initialState,

    openModal: async (modalName, modalAction) =>
        set(() => ({ modalName, modalAction: modalAction || "add" })),
}));

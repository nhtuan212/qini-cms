import { create } from "zustand";

type ModalState = {
    modalName: string;
};

type ModalAction = {
    openModal: (modal: string) => void;
};

const initialState: ModalState = {
    modalName: "",
};

export const useModalStore = create<ModalState & ModalAction>()(set => ({
    ...initialState,

    openModal: modal => set(() => ({ modalName: modal })),
}));

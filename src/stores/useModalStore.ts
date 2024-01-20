import { create } from "zustand";

interface ModalState {
    isModalOpen: boolean;
    openModal: (status: boolean) => void;
}

export const useModalStore = create<ModalState>()(set => ({
    isModalOpen: false,
    openModal: status => set(() => ({ isModalOpen: status })),
}));

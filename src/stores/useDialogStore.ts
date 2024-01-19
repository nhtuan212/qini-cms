import { create } from "zustand";

interface DialogState {
    isDialogOpen: boolean;
    openDialog: (status: boolean) => void;
}

export const useDialogStore = create<DialogState>()(set => ({
    isDialogOpen: false,
    openDialog: status => set(() => ({ isDialogOpen: status })),
}));

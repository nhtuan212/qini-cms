import { create } from "zustand";

interface PaginationState {
    currentPage: number;
    rangePage: number[];

    storeCurrentPage: (value: number) => void;
    storeRangePage: (value: number[]) => void;
}

export const usePaginationStore = create<PaginationState>()(set => ({
    currentPage: 1,
    rangePage: [1, 5],

    storeCurrentPage: (value: number) => set(() => ({ currentPage: value })),
    storeRangePage: (value: number[]) => set(() => ({ rangePage: value })),
}));

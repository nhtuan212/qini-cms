import { create } from "zustand";

interface PaginationState {
    currentPage: number;
    rangePage: number[];

    currentPageStore: (value: number) => void;
    rangePageStore: (value: number[]) => void;
}

export const usePaginationStore = create<PaginationState>()(set => ({
    currentPage: 1,
    rangePage: [1, 5],

    currentPageStore: (value: number) => set(() => ({ currentPage: value })),
    rangePageStore: (value: number[]) => set(() => ({ rangePage: value })),
}));

import { create } from "zustand";

interface TableState {
    checked: readonly number[];
    isAllChecked: boolean;
    checkedStore: (value: readonly number[]) => void;
    allCheckedStore: (status: boolean) => void;
    clearTableStore: () => void;
}

export const useTableStore = create<TableState>()(set => ({
    checked: [],
    isAllChecked: false,
    checkedStore: value => set(() => ({ checked: value })),
    allCheckedStore: status => set(() => ({ isAllChecked: status })),
    clearTableStore: () => set(() => ({ checked: [], isAllChecked: false })),
}));

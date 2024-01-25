import { create } from "zustand";

type TableState = {
    checked: readonly number[];
    isAllChecked: boolean;
    getPageSize: number;

    // Filter value
    filterValue: string;
};

type TableAction = {
    storeFilterValue: (filterValue: string) => void;

    checkedStore: (value: readonly number[]) => void;
    allCheckedStore: (status: boolean) => void;
    setPageSize: (value: number) => void;
    resetTableStore: () => void;
};

// define the initial state
const initialState: TableState = {
    checked: [],
    getPageSize: 5,
    filterValue: "",
    isAllChecked: false,
};

export const useTableStore = create<TableState & TableAction>()(set => ({
    ...initialState,

    // Actions
    storeFilterValue: filterValue => set(() => ({ filterValue })),

    checkedStore: value => set(() => ({ checked: value })),
    allCheckedStore: status => set(() => ({ isAllChecked: status })),
    setPageSize: value => set(() => ({ getPageSize: value })),

    // Reset table store
    resetTableStore: () => {
        set(initialState);
    },
}));

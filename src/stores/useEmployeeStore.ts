import { create } from "zustand";
import { EmployeeProps } from "@/types";

type EmployeeState = {
    selectedEmployee: EmployeeProps | null;
};

type EmployeeAction = {
    setSelectedEmployee: (employee: EmployeeProps | null) => void;
};

const initialState: EmployeeState = {
    selectedEmployee: null,
};

export const useEmployeeStore = create<EmployeeState & EmployeeAction>()(set => ({
    ...initialState,

    setSelectedEmployee: employee =>
        set({
            selectedEmployee: employee,
        }),
}));

import { create } from "zustand";
import { StaffProps } from "@/types";

type StaffState = {
    selectedStaff: StaffProps;
};

type StaffAction = {
    setSelectedStaff: (staff: StaffProps) => void;
};

const initialState: StaffState = {
    selectedStaff: {},
};

export const useStaffStore = create<StaffState & StaffAction>()(set => ({
    ...initialState,

    setSelectedStaff: staff =>
        set({
            selectedStaff: staff,
        }),
}));

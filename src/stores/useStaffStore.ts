import { create } from "zustand";
import { StaffProps } from "@/types";

type StaffState = {
    selectedStaff: StaffProps | null;
};

type StaffAction = {
    setSelectedStaff: (staff: StaffProps | null) => void;
};

const initialState: StaffState = {
    selectedStaff: null,
};

export const useStaffStore = create<StaffState & StaffAction>()(set => ({
    ...initialState,

    setSelectedStaff: staff =>
        set({
            selectedStaff: staff,
        }),
}));

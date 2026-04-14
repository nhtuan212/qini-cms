import { create } from "zustand";
import { ShiftProps } from "@/types";

interface CollectAction {
    setCollectMoney: (shiftId: ShiftProps["id"], status: boolean) => void;
    isCollected: (shiftId: ShiftProps["id"]) => boolean;
}

interface CollectState {
    collectShiftIds: Set<string>;
}

export const useCollectMoneyStore = create<CollectState & CollectAction>((set, get) => ({
    collectShiftIds: new Set(),

    setCollectMoney: (shiftId, status) => {
        return set(state => {
            const next = new Set(state.collectShiftIds);
            status ? next.add(shiftId) : next.delete(shiftId);
            return { collectShiftIds: next };
        });
    },

    isCollected: shiftId => get().collectShiftIds.has(shiftId),
}));

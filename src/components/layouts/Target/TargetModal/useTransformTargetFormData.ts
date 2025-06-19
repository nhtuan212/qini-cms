import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { TargetProps } from "@/stores/useTargetStore";
import { ShiftProps, useShiftStore } from "@/stores/useShiftsStore";
import { formatDate, isEmpty } from "@/utils";

export const useTransformTargetFormData = (target: TargetProps) => {
    //** Stores */
    const { shifts } = useShiftStore();

    //** Variables */
    const name = "Doanh số";
    const targetAt = target.targetAt
        ? parseDate(formatDate(target.targetAt, "YYYY-MM-DD"))
        : today(getLocalTimeZone());

    let targetShift;
    if (isEmpty(target)) {
        targetShift = shifts.map((shift: ShiftProps) => ({
            shiftId: shift.id,
            name: shift.name,
            checkIn: shift.checkIn,
            checkOut: shift.checkOut,
            revenue: 0,
            cash: 0,
            transfer: 0,
            deduction: 0,
            description: "",
            isTarget: shift.isTarget,
            targetStaff: [],
        }));
    } else {
        targetShift =
            target.targetShift?.map((shift: TargetProps["targetShift"]) => ({
                shiftId: shift.shiftId,
                name: shift.targetName,
                checkIn: shifts.find((s: ShiftProps) => s.id === shift.shiftId)?.checkIn,
                checkOut: shifts.find((s: ShiftProps) => s.id === shift.shiftId)?.checkOut,
                revenue: shift.revenue || 0,
                cash: shift.cash || 0,
                transfer: shift.transfer || 0,
                deduction: shift.deduction || 0,
                description: shift.description || "",
                isTarget: shifts.find((s: ShiftProps) => s.id === shift.shiftId)?.isTarget,
                targetStaff: shift.targetStaff.map((staff: TargetProps["targetStaff"]) => ({
                    staffId: staff.staffId,
                    checkIn: staff.checkIn || "",
                    checkOut: staff.checkOut || "",
                })),
            })) || [];
    }

    return {
        name,
        targetAt,
        targetShift,
    };
};

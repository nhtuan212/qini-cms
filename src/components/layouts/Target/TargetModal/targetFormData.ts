import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { TargetProps } from "@/stores/useTargetStore";
import { formatDate } from "@/utils";

export const transformTargetFormData = (target: TargetProps) => {
    const shifts: Record<string, any> = {};

    const name = "Doanh số";
    const targetAt = target.targetAt
        ? parseDate(formatDate(target.targetAt, "YYYY-MM-DD"))
        : today(getLocalTimeZone());

    target.targetShift?.forEach((shift: TargetProps["targetShift"]) => {
        shifts[shift.shiftId] = {
            revenue: shift.revenue || 0,
            cash: shift.cash || 0,
            transfer: shift.transfer || 0,
            deduction: shift.deduction || 0,
            description: shift.description || "",
            staffs: shift.targetStaff.map((staff: TargetProps["targetStaff"]) => ({
                staffId: staff.staffId,
                checkIn: staff.checkIn || "",
                checkOut: staff.checkOut || "",
            })),
        };
    });

    return {
        name,
        targetAt,
        shifts,
    };
};

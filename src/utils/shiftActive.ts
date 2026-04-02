import { ShiftProps } from "@/types";
import { formatDate } from ".";

// Function to check if a shift is currently active based on start/end times (Ca 3: 60-min buffer, others: 30-min buffer)
export const isShiftActive = (shift: ShiftProps): boolean => {
    if (!shift.startTime || !shift.endTime) {
        // In the case is active for "Noi bo" shift
        return true;
    }

    const currentTime = new Date();
    const currentTimeString = formatDate(currentTime, "HH:mm");

    // Convert times to minutes for easier comparison
    const currentMinutes =
        parseInt(currentTimeString.split(":")[0]) * 60 + parseInt(currentTimeString.split(":")[1]);
    const startMinutes =
        parseInt(shift.startTime.split(":")[0]) * 60 + parseInt(shift.startTime.split(":")[1]);
    const endMinutes =
        parseInt(shift.endTime.split(":")[0]) * 60 + parseInt(shift.endTime.split(":")[1]);

    // Buffer minutes for all shifts
    const bufferMinutes = 60;
    return (
        currentMinutes >= startMinutes - bufferMinutes &&
        currentMinutes <= endMinutes + bufferMinutes
    );
};

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

export const getWeekDates = (date: Date): Date[] => {
    // Convert to Vietnam timezone using dayjs (consistent with project)
    const vietnamDate = dayjs.utc(date).tz("Asia/Ho_Chi_Minh");

    // Get the start of the week (Monday) in Vietnam timezone
    const dayOfWeek = vietnamDate.day();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, so -6 to get Monday
    const mondayDate = vietnamDate.add(mondayOffset, "day");

    const dates: Date[] = [];

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
        const dayDate = mondayDate.add(i, "day").toDate();
        dates.push(dayDate);
    }

    return dates;
};

export const getDayName = (date: Date): string => {
    const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
    const dayIndex = (date.getDay() + 6) % 7; // Chuyển Sunday từ 0 thành 6
    return days[dayIndex];
};

export const isDateTodayOrFuture = (date: Date): boolean => {
    // Get today's date in Vietnam timezone
    const today = dayjs.utc().tz("Asia/Ho_Chi_Minh").startOf("day");

    // Convert input date to Vietnam timezone and get start of day
    const compareDate = dayjs.utc(date).tz("Asia/Ho_Chi_Minh").startOf("day");

    return compareDate.isSameOrAfter(today);
};

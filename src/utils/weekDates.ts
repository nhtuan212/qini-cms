export const getWeekDates = (date: Date): Date[] => {
    // Convert to Vietnam timezone (UTC+7)
    const vietnamDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));

    // Get the start of the week (Monday) in Vietnam timezone
    const dayOfWeek = vietnamDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, so -6 to get Monday
    const mondayDate = new Date(vietnamDate);
    mondayDate.setDate(vietnamDate.getDate() + mondayOffset);

    const dates: Date[] = [];

    // Generate 7 days starting from Monday
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(mondayDate);
        dayDate.setDate(mondayDate.getDate() + i);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0); // Reset time to start of day

    return compareDate >= today;
};

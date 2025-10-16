import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

/**
 * Vietnamese public holidays data
 * Format: { year: { month: [day1, day2, ...] } }
 * Month is 1-based (1 = January, 12 = December)
 */
export const VIETNAM_HOLIDAYS: Record<number, Record<number, number[]>> = {
    2024: {
        1: [1], // New Year's Day
        2: [10, 11, 12, 13, 14], // Lunar New Year (Tet) - 5 days
        4: [18, 30], // Hung Kings' Day, Liberation Day
        5: [1], // Labor Day
        9: [1, 2], // National Day (2 days)
    },
    2025: {
        1: [1, 29, 30, 31], // New Year's Day, Lunar New Year (Tet) - 3 days
        2: [1, 2], // Lunar New Year (Tet) - 2 days
        4: [7, 30], // Hung Kings' Day, Liberation Day
        5: [1], // Labor Day
        9: [1, 2], // National Day (2 days)
    },
    2026: {
        1: [1], // New Year's Day
        2: [17, 18, 19, 20, 21], // Lunar New Year (Tet) - 5 days
        4: [26, 30], // Hung Kings' Day, Liberation Day
        5: [1], // Labor Day
        9: [1, 2], // National Day (2 days)
    },
};

/**
 * Check if a specific date is a Vietnamese public holiday
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns boolean indicating if the date is a holiday
 */
export const isVietnamHoliday = (dateString: string): boolean => {
    const date = dayjs.utc(dateString).tz("Asia/Ho_Chi_Minh");
    const year = date.year();
    const month = date.month() + 1; // dayjs month is 0-based, convert to 1-based
    const day = date.date();

    const yearHolidays = VIETNAM_HOLIDAYS[year];
    if (!yearHolidays) return false;

    const monthHolidays = yearHolidays[month];
    if (!monthHolidays) return false;

    return monthHolidays.includes(day);
};

/**
 * Get all Vietnamese holidays for a specific year
 * @param year - Year to get holidays for
 * @returns Array of holiday dates in YYYY-MM-DD format
 */
export const getVietnamHolidaysForYear = (year: number): string[] => {
    const yearHolidays = VIETNAM_HOLIDAYS[year];
    if (!yearHolidays) return [];

    const holidays: string[] = [];

    Object.entries(yearHolidays).forEach(([month, days]) => {
        days.forEach(day => {
            const date = dayjs
                .utc()
                .tz("Asia/Ho_Chi_Minh")
                .year(year)
                .month(parseInt(month) - 1)
                .date(day);
            holidays.push(date.format("YYYY-MM-DD"));
        });
    });

    return holidays.sort();
};

/**
 * Calculate working days excluding Vietnamese holidays and Sundays
 * @param startDate - Start date string (YYYY-MM-DD format)
 * @param endDate - End date string (YYYY-MM-DD format)
 * @returns Number of working days excluding holidays and Sundays
 */
export const getNonWorkingDaysInRange = (startDate: string, endDate: string): number => {
    const start = dayjs.utc(startDate).tz("Asia/Ho_Chi_Minh");
    const end = dayjs.utc(endDate).tz("Asia/Ho_Chi_Minh");

    let workingDays = 0;
    let currentDate = start;

    while (currentDate.isSameOrBefore(end, "day")) {
        // Check if it's not Sunday (0) and not a holiday
        if (currentDate.day() !== 0 && !isVietnamHoliday(currentDate.format("YYYY-MM-DD"))) {
            workingDays++;
        }
        currentDate = currentDate.add(1, "day");
    }

    return workingDays;
};

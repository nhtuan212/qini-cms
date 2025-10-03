import { getNonWorkingDaysInRange } from "./vietnamHolidays";

/**
 * Calculates unique working days from timesheet data, excluding Sundays
 * @param timeSheetData - Array of timesheet records with date property
 * @returns Number of unique working days (excluding Sundays)
 */
export const calculateWorkingDays = (timeSheetData: any[]): number => {
    if (!timeSheetData || timeSheetData.length === 0) return 0;

    return new Set(
        timeSheetData
            .map((record: any) => new Date(record.date))
            .filter((date: Date) => date.getDay() !== 0) // Exclude Sundays (0 = Sunday)
            .map((date: Date) => date.toDateString()),
    ).size;
};

/**
 * Calculates working days in a month (total days minus Sundays)
 * @param year - Year (e.g., 2024)
 * @param month - Month (0-11, where 0 = January)
 * @returns Number of working days in the month (excluding Sundays)
 */
export const calculateWorkingDaysInMonth = (year: number, month: number): number => {
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0).getDate();

    // Count Sundays in the month
    let sundayCount = 0;
    for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, month, day);
        if (date.getDay() === 0) {
            // Sunday
            sundayCount++;
        }
    }

    // Working days = total days - Sundays
    return lastDay - sundayCount;
};

/**
 * Calculates working days for a date range excluding Vietnamese holidays and Sundays
 * @param startDate - Start date string (YYYY-MM-DD format)
 * @param endDate - End date string (YYYY-MM-DD format)
 * @returns Number of working days in the date range (excluding Sundays and holidays)
 */
export const calculateWorkingDaysInRange = (startDate: string, endDate: string): number => {
    return getNonWorkingDaysInRange(startDate, endDate);
};

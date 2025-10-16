/**
 * Utility functions for calculating working hours with break time deduction
 */

/**
 * Calculate working hours with break time deduction
 * If working hours >= 8.5 hours per day, deduct 1 hour for break time
 *
 * @param timeSheetData - Array of timesheet records with workingHours property
 * @returns Object with total working hours and break time information
 */
export const calculateWorkingHoursWithBreak = (
    timeSheetData: any[],
): {
    totalWorkingHours: number;
    totalBreakHours: number;
    daysWithBreak: number;
    breakdown: Array<{
        date: string;
        workingHours: number;
        breakHours: number;
        finalHours: number;
    }>;
} => {
    if (!timeSheetData || timeSheetData.length === 0) {
        return {
            totalWorkingHours: 0,
            totalBreakHours: 0,
            daysWithBreak: 0,
            breakdown: [],
        };
    }

    let totalWorkingHours = 0;
    let totalBreakHours = 0;
    let daysWithBreak = 0;
    const breakdown: Array<{
        date: string;
        workingHours: number;
        breakHours: number;
        finalHours: number;
    }> = [];

    // Group timesheet data by date
    const dailyHours: { [date: string]: number } = {};

    timeSheetData.forEach(record => {
        const date = new Date(record.date).toDateString();
        const workingHours = record.workingHours || 0;

        if (dailyHours[date]) {
            dailyHours[date] += workingHours;
        } else {
            dailyHours[date] = workingHours;
        }
    });

    // Calculate break time for each day
    Object.entries(dailyHours).forEach(([date, workingHours]) => {
        const breakHours = workingHours >= 8.5 ? 1 : 0;
        const finalHours = workingHours - breakHours;

        totalWorkingHours += finalHours;
        totalBreakHours += breakHours;

        if (breakHours > 0) {
            daysWithBreak++;
        }

        breakdown.push({
            date,
            workingHours,
            breakHours,
            finalHours,
        });
    });

    return {
        totalWorkingHours: Math.round(totalWorkingHours * 10) / 10, // Round to 1 decimal place
        totalBreakHours,
        daysWithBreak,
        breakdown,
    };
};

/**
 * Calculate working hours for a single day with break time
 *
 * @param workingHours - Working hours for the day
 * @returns Object with working hours and break time information
 */
export const calculateDailyWorkingHoursWithBreak = (
    workingHours: number,
): {
    originalHours: number;
    breakHours: number;
    finalHours: number;
    hasBreak: boolean;
} => {
    const breakHours = workingHours >= 8.5 ? 1 : 0;
    const finalHours = workingHours - breakHours;

    return {
        originalHours: workingHours,
        breakHours,
        finalHours: Math.round(finalHours * 10) / 10,
        hasBreak: breakHours > 0,
    };
};

/**
 * Format working hours breakdown for display
 */
export const formatWorkingHoursBreakdown = (
    breakdown: Array<{
        date: string;
        workingHours: number;
        breakHours: number;
        finalHours: number;
    }>,
) => {
    return breakdown.map(day => ({
        ...day,
        dateFormatted: new Date(day.date).toLocaleDateString("vi-VN"),
        workingHoursFormatted: `${day.workingHours}h`,
        breakHoursFormatted: day.breakHours > 0 ? `${day.breakHours}h` : "0h",
        finalHoursFormatted: `${day.finalHours}h`,
    }));
};

/**
 * Example usage and test cases
 */
export const workingHoursBreakExamples = () => {
    const testData = [
        { date: "2024-01-01", workingHours: 8.0 },
        { date: "2024-01-02", workingHours: 9.5 },
        { date: "2024-01-03", workingHours: 8.5 },
        { date: "2024-01-04", workingHours: 7.0 },
        { date: "2024-01-05", workingHours: 10.0 },
    ];

    const result = calculateWorkingHoursWithBreak(testData);

    console.log("Working Hours with Break Calculation:");
    console.log("Total Working Hours (after break):", result.totalWorkingHours);
    console.log("Total Break Hours:", result.totalBreakHours);
    console.log("Days with Break:", result.daysWithBreak);
    console.log("Breakdown:", result.breakdown);

    return result;
};

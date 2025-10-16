/**
 * Example demonstrating break time calculation for working hours
 * Break time: 1 hour deducted per day when working hours >= 8.5 hours
 */

import {
    calculateWorkingHoursWithBreak,
    calculateDailyWorkingHoursWithBreak,
    formatWorkingHoursBreakdown,
} from "@/utils/workingHoursWithBreak";

// Example 1: Daily break time calculation
export const dailyBreakTimeExample = () => {
    const examples = [
        { workingHours: 7.0, expected: "No break (7h)" },
        { workingHours: 8.0, expected: "No break (8h)" },
        { workingHours: 8.5, expected: "1h break (7.5h final)" },
        { workingHours: 9.0, expected: "1h break (8h final)" },
        { workingHours: 10.0, expected: "1h break (9h final)" },
        { workingHours: 12.0, expected: "1h break (11h final)" },
    ];

    console.log("Daily Break Time Calculation Examples:");
    examples.forEach(example => {
        const result = calculateDailyWorkingHoursWithBreak(example.workingHours);
        console.log(`${example.workingHours}h → ${result.finalHours}h (${example.expected})`);
    });

    return examples.map(example => ({
        ...example,
        result: calculateDailyWorkingHoursWithBreak(example.workingHours),
    }));
};

// Example 2: Weekly timesheet with break time
export const weeklyBreakTimeExample = () => {
    const weeklyTimesheet = [
        { date: "2024-01-01", workingHours: 8.0 }, // Monday - No break
        { date: "2024-01-02", workingHours: 9.5 }, // Tuesday - 1h break
        { date: "2024-01-03", workingHours: 8.5 }, // Wednesday - 1h break
        { date: "2024-01-04", workingHours: 7.0 }, // Thursday - No break
        { date: "2024-01-05", workingHours: 10.0 }, // Friday - 1h break
    ];

    const result = calculateWorkingHoursWithBreak(weeklyTimesheet);

    console.log("Weekly Timesheet with Break Time:");
    console.log("Total Working Hours (after break):", result.totalWorkingHours);
    console.log("Total Break Hours:", result.totalBreakHours);
    console.log("Days with Break:", result.daysWithBreak);
    console.log("Breakdown:", result.breakdown);

    return result;
};

// Example 3: Salary calculation with break time
export const salaryWithBreakTimeExample = () => {
    const timesheetData = [
        { date: "2024-01-01", workingHours: 8.0 },
        { date: "2024-01-02", workingHours: 9.5 },
        { date: "2024-01-03", workingHours: 8.5 },
        { date: "2024-01-04", workingHours: 7.0 },
        { date: "2024-01-05", workingHours: 10.0 },
    ];

    const workingHoursWithBreak = calculateWorkingHoursWithBreak(timesheetData);

    // Salary calculation parameters
    const hourlyRate = 25000; // 25,000 VND per hour
    const target = 5000000; // 5,000,000 VND target
    const bonus = 200000; // 200,000 VND bonus

    // Calculate salary with break time
    const salaryWithBreak = Math.floor(
        hourlyRate * workingHoursWithBreak.totalWorkingHours + target * 0.01 + bonus,
    );

    // Calculate salary without break time (for comparison)
    const totalHoursWithoutBreak = timesheetData.reduce((sum, day) => sum + day.workingHours, 0);
    const salaryWithoutBreak = Math.floor(
        hourlyRate * totalHoursWithoutBreak + target * 0.01 + bonus,
    );

    const difference = salaryWithoutBreak - salaryWithBreak;

    console.log("Salary Calculation with Break Time:");
    console.log("Working Hours (with break):", workingHoursWithBreak.totalWorkingHours);
    console.log("Working Hours (without break):", totalHoursWithoutBreak);
    console.log("Break Hours:", workingHoursWithBreak.totalBreakHours);
    console.log("Salary (with break):", salaryWithBreak.toLocaleString("vi-VN"), "VND");
    console.log("Salary (without break):", salaryWithoutBreak.toLocaleString("vi-VN"), "VND");
    console.log("Difference:", difference.toLocaleString("vi-VN"), "VND");

    return {
        workingHoursWithBreak,
        salaryWithBreak,
        salaryWithoutBreak,
        difference,
        breakdown: formatWorkingHoursBreakdown(workingHoursWithBreak.breakdown),
    };
};

// Example 4: Different scenarios
export const breakTimeScenarios = () => {
    const scenarios = [
        {
            name: "Light Work Week",
            timesheet: [
                { date: "2024-01-01", workingHours: 7.0 },
                { date: "2024-01-02", workingHours: 7.5 },
                { date: "2024-01-03", workingHours: 8.0 },
                { date: "2024-01-04", workingHours: 7.0 },
                { date: "2024-01-05", workingHours: 8.0 },
            ],
        },
        {
            name: "Heavy Work Week",
            timesheet: [
                { date: "2024-01-01", workingHours: 9.0 },
                { date: "2024-01-02", workingHours: 10.0 },
                { date: "2024-01-03", workingHours: 9.5 },
                { date: "2024-01-04", workingHours: 8.5 },
                { date: "2024-01-05", workingHours: 11.0 },
            ],
        },
        {
            name: "Mixed Work Week",
            timesheet: [
                { date: "2024-01-01", workingHours: 8.0 },
                { date: "2024-01-02", workingHours: 9.5 },
                { date: "2024-01-03", workingHours: 7.5 },
                { date: "2024-01-04", workingHours: 8.5 },
                { date: "2024-01-05", workingHours: 8.0 },
            ],
        },
    ];

    return scenarios.map(scenario => {
        const result = calculateWorkingHoursWithBreak(scenario.timesheet);
        const totalHoursWithoutBreak = scenario.timesheet.reduce(
            (sum, day) => sum + day.workingHours,
            0,
        );

        return {
            name: scenario.name,
            totalHoursWithoutBreak,
            totalHoursWithBreak: result.totalWorkingHours,
            breakHours: result.totalBreakHours,
            daysWithBreak: result.daysWithBreak,
            efficiency: Math.round((result.totalWorkingHours / totalHoursWithoutBreak) * 100),
            breakdown: result.breakdown,
        };
    });
};

// Run examples
export const runAllBreakTimeExamples = () => {
    console.log("=== BREAK TIME CALCULATION EXAMPLES ===\n");

    console.log("1. Daily Break Time Calculation:");
    dailyBreakTimeExample();

    console.log("\n2. Weekly Timesheet with Break Time:");
    weeklyBreakTimeExample();

    console.log("\n3. Salary Calculation with Break Time:");
    salaryWithBreakTimeExample();

    console.log("\n4. Different Work Scenarios:");
    const scenarios = breakTimeScenarios();
    scenarios.forEach(scenario => {
        console.log(
            `${scenario.name}: ${scenario.totalHoursWithBreak}h (${scenario.breakHours}h break, ${scenario.efficiency}% efficiency)`,
        );
    });

    return scenarios;
};

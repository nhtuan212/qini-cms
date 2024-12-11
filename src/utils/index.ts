"use client";

import dayjs from "dayjs";

export const wrongTimeSheet = ({
    checkIn,
    checkOut,
}: {
    checkIn: Date | string;
    checkOut: Date | string;
}) => {
    const checkInTime = new Date(`2024-01-01T${checkIn}`).getTime();
    const checkOutTime = new Date(`2024-01-01T${checkOut}`).getTime();

    return checkOutTime <= checkInTime;
};

export const currencyFormat = (amount: number) => {
    if (amount) return new Intl.NumberFormat("it-IT").format(amount);

    return 0;
};

export const formatDate = (date: Date | null, format: string = "DD/MM/YYYY") => {
    if (!date) return dayjs().format(format);

    return dayjs(date).format(format);
};

export const dateFormat = (date: Date) => {
    const dateFormat = new Date(date);

    const day = String(dateFormat.getUTCDate()).padStart(2, "0");
    const month = String(dateFormat.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
    const year = dateFormat.getUTCFullYear();

    return `${year}-${month}-${day}`;
};

export const getCurrentMonth = () => {
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
        startDate: formatDate(startDate, "YYYY-MM-DD"),
        endDate: formatDate(endDate, "YYYY-MM-DD"),
    };
};

/**
 * Checks if the provided data is empty.
 *
 * @param data - The data to check, which can be an array of strings or numbers, or an object.
 * @returns `true` if the data is empty, `false` otherwise.
 */
export const isEmpty = (data: Array<string | number> | object) => {
    if (!data) return true;

    if (Array.isArray(data)) {
        return data.length === 0;
    }

    return Object.keys(data).length === 0;
};

/**
 * Sums the values of a specified field in an array of objects.
 *
 * @param array - The array of objects to sum.
 * @param field - The field in each object whose values should be summed.
 * @returns The sum of the values of the specified field in the array.
 */
export const sumArray = (array: any[], field: string): number => {
    if (!array?.length) return 0;

    return array.reduce((accumulator, item) => {
        return accumulator + item[field];
    }, 0);
};

/**
 * Creates a debounced function that delays the invocation of the provided function until after a specified wait time has elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay; defaults to 300 milliseconds.
 * @returns A debounced function that delays the invocation of `func`.
 */
export const debounce = (func: (...args: any[]) => void, wait = 1000) => {
    let timeout: any;

    return (...args: any) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
};

/**
 * Breaks a string into multiple lines of a specified length.
 *
 * @param str - The string to break into lines.
 * @param maxLength - The maximum length of each line.
 * @returns The string broken into multiple lines.
 */
export function breakStringIntoLines(str: string): string[] {
    if (!str) return [];

    const lines = str.split("\n");
    const result: string[] = [];

    for (const line of lines) {
        if (line.includes("\n")) {
            result.push(...line.split("\n"));
        } else {
            result.push(line);
        }
    }

    return result;
}

"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getLocalTimeZone, startOfMonth, Time, today } from "@internationalized/date";

dayjs.extend(utc);

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

export const convertAmountToNumber = (amount: string) => {
    if (!amount) return 0;

    return parseFloat(amount.replace(/[^0-9]/g, ""));
};

export const formatDate = (date: Date | string | number | null, format: string = "DD/MM/YYYY") => {
    if (!date) return "undefined";

    return dayjs.utc(date).format(format);
};

export const getDateTime = () => {
    const now = today(getLocalTimeZone());

    return {
        firstDayOfMonth: startOfMonth(now),
        lastDayOfMonth: now,
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

/**
 * Converts an object to a query string.
 *
 * @param obj - The object to convert to a query string.
 * @returns The query string.
 */
export function convertObjectToSearchQuery(obj: object): string {
    if (!obj) return "";

    const params = new URLSearchParams(
        Object.entries(obj)
            .filter(([key, value]) => key !== "" && value)
            .map(([key, value]) => [key, String(value)]),
    );

    return `?${params.toString()}`;
}

/**
 * Converts a string from snake_case to camelCase.
 *
 * @param str - The string to convert.
 * @returns The converted string.
 */
const toCamelCase = (str: string) => {
    return str.replace(/([-_][a-z])/gi, $1 => {
        return $1.toUpperCase().replace("-", "").replace("_", "");
    });
};

const toSnakeCase = (str: string) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

export const convertKeysToCamelCase = (obj: {
    [key: string]: any;
}): Array<{ [key: string]: any }> | { [key: string]: any } => {
    if (Array.isArray(obj)) {
        return obj.map(item => convertKeysToCamelCase(item));
    } else if (typeof obj === "object" && obj !== null) {
        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            newObj[toCamelCase(key)] = convertKeysToCamelCase((obj as { [key: string]: any })[key]);
        }
        return newObj;
    } else {
        return obj;
    }
};

export const convertKeysToSnakeCase = (
    obj: object,
): Array<{ [key: string]: any }> | { [key: string]: any } => {
    if (Array.isArray(obj)) {
        return obj.map(item => convertKeysToSnakeCase(item));
    } else if (typeof obj === "object" && obj !== null) {
        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            newObj[key.replace(/[A-Z]/g, g => `_${g.toLowerCase()}`)] = convertKeysToSnakeCase(
                (obj as { [key: string]: any })[key],
            );
        }
        return newObj;
    } else {
        return obj;
    }
};

export const roundToThousand = (number: number) => {
    return Math.round(number / 1000) * 1000;
};

export const parseTimeString = (timeString: string) => {
    if (!timeString) return new Time(0, 0);

    const [hours, minutes] = timeString.split(":");
    return new Time(Number(hours), Number(minutes));
};

export const snakeCaseQueryString = (
    params: URLSearchParams | Record<string, any>,
    prefix: "?" | "&" = "?",
): string => {
    const entries =
        params instanceof URLSearchParams ? Object.fromEntries(params.entries()) : params;

    const snakeEntries = Object.entries(entries).map(([key, value]) => [toSnakeCase(key), value]);

    const queryString = new URLSearchParams(snakeEntries).toString();

    return queryString ? `${prefix}${queryString}` : "";
};

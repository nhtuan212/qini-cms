"use client";

import moment from "moment";

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

export const dateFormat = (date: Date) => {
    if (date) return new Intl.DateTimeFormat("vi-VN").format(new Date(date));

    return "Date is not valid";
};

export const dateFormat2 = (date: Date) => {
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
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
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

export const sumArray = (array: any[], field: string): number => {
    if (!array?.length) return 0;

    return array.reduce((accumulator, item) => {
        return accumulator + item[field];
    }, 0);
};

"use client";

export const getHours = (date: Date | string) => {
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();

    return `${hours}:${minutes}`;
};

export const wrongTimeSheet = ({
    checkIn,
    checkOut,
}: {
    checkIn: Date | string;
    checkOut: Date | string;
}) => {
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();

    return checkOutTime <= checkInTime;
};

export const currencyFormat = (amount: number) => {
    if (amount)
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
            amount,
        );

    return 0;
};

export const dateFormat = (date: Date) => {
    if (date) return new Intl.DateTimeFormat("vi-VN").format(new Date(date));

    return "Date is not valid";
};

export const isEmpty = (obj: {}) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
};

export const sumArray = (array: number[]): number => {
    if (!array.length) return 0;

    return array.reduce((accumulator, item) => {
        return accumulator + item;
    }, 0);
};

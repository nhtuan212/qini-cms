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

export const getCurrentMonth = () => {
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
    };
};

// export const isEmpty = (obj: {}) => {
//     for (const prop in obj) {
//         if (Object.hasOwn(obj, prop)) {
//             return false;
//         }
//     }

//     return true;
// };

export const sumArray = (array: any[], field: string): number => {
    if (!array?.length) return 0;

    return array.reduce((accumulator, item) => {
        return accumulator + item[field];
    }, 0);
};

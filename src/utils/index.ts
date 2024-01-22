"use client";
import { baseUrl } from "@/config/routes";
import { useEffect, useRef } from "react";

export const fetchData = async ({
    endpoint,
    options,
}: {
    endpoint: string | URL;
    options?: RequestInit;
}): Promise<any> => {
    const url = `${baseUrl}${endpoint}`;

    return await fetch(url, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        ...options,
    })
        .then(res => res.json())
        .catch(() => {
            throw new Error("Failed to fetch data");
        });
};

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

    return checkInTime > checkOutTime;
};

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
    const innerRef = useRef<T>(null);

    useEffect(() => {
        if (!ref) return;
        if (typeof ref === "function") {
            ref(innerRef.current);
        } else {
            ref.current = innerRef.current;
        }
    });

    return innerRef;
}

"use client";

import { useCallback, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => any>(
    fn: T,
    delay = 300,
): (...args: Parameters<T>) => void {
    const isPending = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fnRef = useRef(fn);

    fnRef.current = fn;

    return useCallback(
        (...args: Parameters<T>) => {
            if (isPending.current) return;

            if (timerRef.current !== null) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                timerRef.current = null;
                isPending.current = true;
                Promise.resolve(fnRef.current(...args)).finally(() => {
                    isPending.current = false;
                });
            }, delay);
        },
        [delay],
    );
}

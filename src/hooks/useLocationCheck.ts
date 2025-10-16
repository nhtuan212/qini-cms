"use client";

import { useEffect, useState } from "react";
import { getCurrentLocation, verifyLocation, LocationVerificationResult } from "@/utils/location";

interface UseLocationCheckReturn {
    isLocationValid: boolean | null;
    locationResult: LocationVerificationResult | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useLocationCheck = (): UseLocationCheckReturn => {
    const [isLocationValid, setIsLocationValid] = useState<boolean | null>(null);
    const [locationResult, setLocationResult] = useState<LocationVerificationResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const checkLocation = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const { lat, lng } = await getCurrentLocation();
            const result = verifyLocation(lat, lng);

            setLocationResult(result);
            setIsLocationValid(result.isValid);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            setError(errorMessage);
            setIsLocationValid(false);
            setLocationResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const refetch = async (): Promise<void> => {
        await checkLocation();
    };

    useEffect(() => {
        checkLocation();
    }, []);

    return {
        isLocationValid,
        locationResult,
        isLoading,
        error,
        refetch,
    };
};

export interface LocationBounds {
    id: string;
    name: string;
    lat: number;
    lng: number;
    radiusMeters: number;
}

export interface LocationVerificationResult {
    isValid: boolean;
    distance?: number;
    locationName?: string;
    message: string;
}

export const ALLOWED_LOCATIONS: LocationBounds[] = [
    {
        id: "location-1",
        name: "Qini",
        lat: 10.85916870336859,
        lng: 106.76264095290371,
        radiusMeters: 100,
    },
    {
        id: "location-2",
        name: "CaAdv",
        lat: 10.782565871848758,
        lng: 106.69742843582436,
        radiusMeters: 50,
    },
];

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const verifyLocation = (userLat: number, userLng: number): LocationVerificationResult => {
    for (const location of ALLOWED_LOCATIONS) {
        const distance = calculateDistance(userLat, userLng, location.lat, location.lng);

        if (distance <= location.radiusMeters) {
            return {
                isValid: true,
                locationName: location.name,
                distance: Math.round(distance),
                message: `✅ Hợp lệ tại ${location.name} (${Math.round(distance)}m)`,
            };
        }
    }

    const nearest = ALLOWED_LOCATIONS.reduce((prev, curr) => {
        const prevDist = calculateDistance(userLat, userLng, prev.lat, prev.lng);
        const currDist = calculateDistance(userLat, userLng, curr.lat, curr.lng);
        return currDist < prevDist ? curr : prev;
    });

    const nearestDistance = calculateDistance(userLat, userLng, nearest.lat, nearest.lng);

    return {
        isValid: false,
        locationName: nearest.name,
        distance: Math.round(nearestDistance),
        message: `❌ Vị trí không hợp lệ`,
    };
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number; accuracy: number }> =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Không hỗ trợ GPS"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position =>
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                }),
            reject,
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
        );
    });

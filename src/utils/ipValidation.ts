export interface IPValidationConfig {
    allowedIPs: string[];
    errorMessage?: string;
}

export const DEFAULT_ALLOWED_IPS = [
    "171.248.241.167", // Qini
    "118.155.249.8", // CaAdv
    "116.111.185.110", // My home
];

export const DEFAULT_IP_ERROR_MESSAGE =
    "Access denied: You can only check in/out from authorized locations";

/**
 * Get user's current IP address
 */
export const getUserIP = async (): Promise<string> => {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipResponse.json();
    return ip;
};

/**
 * Check if an IP address is in the allowed list
 */
export const isIPAllowed = (userIP: string, allowedIPs: string[]): boolean => {
    return allowedIPs.some(allowedIP => {
        if (allowedIP.includes("/")) {
            // Handle CIDR notation - simplified check
            const [network] = allowedIP.split("/");
            return userIP.startsWith(network.split(".").slice(0, -1).join("."));
        }
        return userIP === allowedIP;
    });
};

/**
 * Validate user's IP address against allowed IPs
 */
export const validateUserIP = async (
    config?: Partial<IPValidationConfig>,
): Promise<{ isValid: boolean; ip: string; error?: string }> => {
    const allowedIPs = config?.allowedIPs || DEFAULT_ALLOWED_IPS;
    const errorMessage = config?.errorMessage || DEFAULT_IP_ERROR_MESSAGE;

    try {
        const userIP = await getUserIP();
        const isValid = isIPAllowed(userIP, allowedIPs);

        return {
            isValid,
            ip: userIP,
            error: isValid ? undefined : errorMessage,
        };
    } catch (error) {
        console.error("IP validation error:", error);
        return {
            isValid: false,
            ip: "",
            error: "IP validation failed.",
        };
    }
};

import NodeRSA from "node-rsa";
import { RSA_PUBLIC_KEY } from "@/constants";

/**
 * Generate RSA key pair for development/testing
 * In production, keys should be generated securely and stored properly
 * @returns object containing public and private keys
 */
export const generateRSAKeyPair = () => {
    const key = new NodeRSA({ b: 2048 });
    return {
        publicKey: key.exportKey("public"),
        privateKey: key.exportKey("private"),
    };
};

/**
 * Encrypt password using RSA public key
 * @param password - Plain text password to encrypt
 * @returns string - RSA encrypted password (base64 encoded)
 */
export const encryptPasswordRSA = (password: string): string => {
    try {
        const key = new NodeRSA({ b: 2048 });
        key.importKey(RSA_PUBLIC_KEY, "public");

        const encrypted = key.encrypt(password, "base64");
        return encrypted;
    } catch (error) {
        console.error("RSA encryption error:", error);
        throw new Error("Failed to encrypt password");
    }
};

import NodeRSA from "node-rsa";

const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArONVr97hZdyzx2uEiHsm
BiTmyGUc2GVF447USXEMbHn/QEom0ozMDqpbBusqFllPE/Yo7IILD9YDNvo3bQC6
pVqUBefH35uEU8LXJZn/Boa8mer9hkl075zkEAwGClp8qTf52V8UukOtHUrwKgp4
PHryTa0iLyuc3OKQP26nUb2+7QMoOSv+3U5JDTW7zXstqzuK1nBi0RH3NqZJw4JL
CJ+ON0K/EsQ9HoXgHOUy0PyOYxjFx+qq3Bgpaiqzoi1blaf8hIpUDZYzqRueX6Ed
0kkibAOrN9bG/d6Yl6pHk6hk/+c1KOk1HnkXO2h6pkoP9KV+KUmoxjKVLWGTq039
bQIDAQAB
-----END PUBLIC KEY-----`;

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

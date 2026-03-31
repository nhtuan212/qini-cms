import { encryptPasswordRSA } from "@/utils";

self.onmessage = ({ data }) => {
    const encrypt = encryptPasswordRSA(data);
    self.postMessage(encrypt);
};

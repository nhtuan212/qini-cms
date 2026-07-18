let accessToken: string | undefined;

export const setAccessToken = (token?: string) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

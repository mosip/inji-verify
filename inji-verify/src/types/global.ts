export {};

declare global {
    interface Window {
        encodeData: (data: string) => void;
        _env_: {
            INTERNET_CONNECTIVITY_CHECK_ENDPOINT: string,
            INTERNET_CONNECTIVITY_CHECK_TIMEOUT: string,
            OVP_CLIENT_ID: string
        }
    }
}
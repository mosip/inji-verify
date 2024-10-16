export {};

declare global {
    interface Window {
        encodeData: (data: string) => void;
        _env_: {
            DEFAULT_TITLE: string;
            DEFAULT_THEME: string;
            DEFAULT_FONT_URL: string;
            OVP_QR_HEADER: string
            INTERNET_CONNECTIVITY_CHECK_ENDPOINT: string,
            INTERNET_CONNECTIVITY_CHECK_TIMEOUT: string,
           
        }
    }
}
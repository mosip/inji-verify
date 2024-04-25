export {};

declare global {
    interface Window {
        encodeData: (data: string) => void;
    }
}
export {};

declare global {
    interface Window {
        encodeVc: (vc: any) => void;
    }
}
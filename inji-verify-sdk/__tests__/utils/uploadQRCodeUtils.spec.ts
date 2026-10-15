jest.mock("zxing-wasm/full", () => ({
    readBarcodes: jest.fn(),
}));

jest.mock("pdfjs-dist", () => ({
    GlobalWorkerOptions: {},
    getDocument: jest.fn(),
}));

jest.mock("pdfjs-dist/build/pdf.worker.mjs", () => "pdf-worker");

import {readBarcodes} from "zxing-wasm/full";

const pdfjsLib = require("pdfjs-dist");

Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: jest.fn(() => "blob:test"),
});

const {readQRcodeFromImageFile, scanFilesForQr} = require("../../src/utils/uploadQRCodeUtils");

describe("readQRcodeFromImageFile", () => {
    const imageFile = {
        arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    } as unknown as File;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("reports a dedicated error when an image contains multiple valid QR codes", async () => {
        (readBarcodes as jest.Mock).mockResolvedValue([
            {isValid: true, text: "first-qr", format: "QRCode"},
            {isValid: true, text: "second-qr", format: "QRCode"},
        ]);

        await expect(readQRcodeFromImageFile(imageFile, "QRCode")).rejects.toMatchObject({
            name: "MULTIPLE_QR_FOUND",
            message: "Multiple QR codes detected, please retry with an image containing a single QR code.",
        });
    });

    test("continues to return one valid QR code", async () => {
        (readBarcodes as jest.Mock).mockResolvedValue([
            {isValid: true, text: "single-qr", format: "QRCode"},
        ]);

        await expect(readQRcodeFromImageFile(imageFile, "QRCode")).resolves.toBe("single-qr");
    });

    test("reports multiple QR codes when a PDF contains different QR values", async () => {
        const page = {
            getViewport: jest.fn(() => ({height: 100, width: 100})),
            render: jest.fn(() => ({promise: Promise.resolve()})),
        };
        pdfjsLib.getDocument.mockReturnValue({
            promise: Promise.resolve({
                numPages: 1,
                getPage: jest.fn().mockResolvedValue(page),
            }),
        });
        jest.spyOn(document, "createElement").mockImplementation(((tagName: string) => {
            if (tagName === "canvas") {
                return {
                    getContext: jest.fn(() => ({drawImage: jest.fn()})),
                    width: 100,
                    height: 100,
                    toDataURL: jest.fn(() => "data:image/png;base64,test"),
                } as unknown as HTMLCanvasElement;
            }
            return document.createElement(tagName);
        }) as typeof document.createElement);
        global.fetch = jest.fn().mockResolvedValue({blob: jest.fn().mockResolvedValue(new Blob())}) as jest.Mock;
        const originalFile = global.File;
        global.File = jest.fn(() => imageFile) as unknown as typeof File;
        (readBarcodes as jest.Mock)
            .mockResolvedValueOnce([{isValid: true, text: "first-qr", format: "QRCode"}])
            .mockResolvedValueOnce([{isValid: true, text: "second-qr", format: "QRCode"}]);

        const result = await scanFilesForQr({
            type: "application/pdf",
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
        } as unknown as File);

        global.File = originalFile;

        expect(result.error).toMatchObject({
            name: "MULTIPLE_QR_FOUND",
            message: "Multiple QR codes detected, please retry with an image containing a single QR code.",
        });
    });

    test("returns a dense PDF QR decoded after an earlier failed attempt", async () => {
        const page = {
            getViewport: jest.fn((({scale}) => ({height: 100 * scale, width: 100 * scale}))),
            render: jest.fn(() => ({promise: Promise.resolve()})),
        };
        pdfjsLib.getDocument.mockReturnValue({
            promise: Promise.resolve({
                numPages: 1,
                getPage: jest.fn().mockResolvedValue(page),
            }),
        });
        const createElement = document.createElement.bind(document);
        const createElementSpy = jest.spyOn(document, "createElement").mockImplementation(((tagName: string) => {
            if (tagName === "canvas") {
                return {
                    getContext: jest.fn(() => ({drawImage: jest.fn()})),
                    width: 100,
                    height: 100,
                    toDataURL: jest.fn(() => "data:image/png;base64,test"),
                } as unknown as HTMLCanvasElement;
            }
            return createElement(tagName);
        }) as typeof document.createElement);
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({blob: jest.fn().mockResolvedValue(new Blob())}) as jest.Mock;
        const originalFile = global.File;
        global.File = jest.fn(() => imageFile) as unknown as typeof File;
        try {
            let attempts = 0;
            (readBarcodes as jest.Mock).mockImplementation(() => {
                attempts++;
                return Promise.resolve(
                    attempts === 11
                        ? [{isValid: true, text: "dense-qr", format: "QRCode"}]
                        : [{isValid: false, text: "", format: "QRCode"}],
                );
            });

            const result = await scanFilesForQr({
                type: "application/pdf",
                arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
            } as unknown as File);

            expect(result).toEqual({data: "dense-qr", error: null});
            expect(page.getViewport).toHaveBeenNthCalledWith(1, {scale: 2});
            expect(page.getViewport).toHaveBeenNthCalledWith(2, {scale: 2.5});
            expect(page.getViewport).toHaveBeenNthCalledWith(3, {scale: 3});
        } finally {
            global.File = originalFile;
            global.fetch = originalFetch;
            createElementSpy.mockRestore();
        }
    });
});

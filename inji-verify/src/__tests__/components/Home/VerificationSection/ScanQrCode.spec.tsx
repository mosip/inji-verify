import React from 'react';
import {render, screen} from "@testing-library/react";
import ScanQrCode from "../../../../components/Home/VerificationSection/ScanQrCode";

jest.mock("../../../../redux/hooks", () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

jest.mock("@mosip/pixelpass", () => ({
    decode: jest.fn()
}))

describe("Scan Qr Code", () => {
    test("Test rendering", () => {
        const api = require("../../../../redux/hooks");
        api.useAppSelector.mockReturnValue("NOT_READ");

        render(<ScanQrCode/>);
        expect(screen.getByText("Scan QR Code or Upload an Image")).toBeInTheDocument();
        expect(screen.getByText("Scan QR Code")).toBeInTheDocument();
        expect(screen.getByText("Upload QR Code")).toBeInTheDocument();
    })

    test("Test rendering", () => {
        const api = require("../../../../redux/hooks");
        api.useAppSelector.mockReturnValue("FAILED");
        render(<ScanQrCode/>);
        expect(screen.getByText("Upload Another QR Code")).toBeInTheDocument();
    })
})

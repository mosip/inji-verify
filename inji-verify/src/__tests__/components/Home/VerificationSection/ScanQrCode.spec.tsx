import React from "react";
import {render, screen} from "@testing-library/react";
import ScanQrCode from "../../../../components/Home/VerificationSection/ScanQrCode";

describe("ScanQrCode", () => {
    test("", () => {
        const setScanResultMock = jest.fn();
        render(<ScanQrCode setScanResult={setScanResultMock}/>)
        expect(screen.getByText("Scan the QR Code")).toBeInTheDocument();
        expect(screen.getByText("Upload QR Code")).toBeInTheDocument();
    })
})
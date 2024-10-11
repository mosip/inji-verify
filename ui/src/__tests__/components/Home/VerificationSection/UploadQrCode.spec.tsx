import React from 'react';
import {render, screen} from "@testing-library/react";
import {UploadQrCode} from "../../../../components/Home/VerificationSection/UploadQrCode";

jest.mock("../../../../redux/hooks", () => ({
    useAppDispatch: jest.fn()
}));

jest.mock("@mosip/pixelpass", () => ({
    decode: jest.fn()
}))

describe("Stepper Content Header", () => {
    test("Test rendering", () => {
        render(<UploadQrCode displayMessage="Upload Qr Code"/>)
        expect(screen.getByText("Upload Qr Code")).toBeInTheDocument()
    })
})


import React from "react";
import {render, screen} from "@testing-library/react";
import {UploadButton, UploadQrCode} from "../../../../components/Home/VerificationSection/UploadQrCode";


describe("UploadQrCode", () => {
    const displayMessage = "Upload Qr Code";
    const id = "upload-qr";
    test("Rendering upload button", () => {
        render(<UploadButton displayMessage={displayMessage}/>)
        expect(screen.getByText("Upload Qr Code")).toBeInTheDocument();
        expect(screen.getByTestId("upload-qr-label")).toBeInTheDocument();
    })

    test("Test input field and label", () => {
        const setScanResultMock = jest.fn();
        const setScanStatusMock = jest.fn();
        render(<UploadQrCode setScanResult={setScanResultMock} displayMessage={displayMessage} setScanStatus={setScanStatusMock}/>);

        expect(screen.getByText("Upload Qr Code")).toBeInTheDocument();
        expect(screen.getByTestId("upload-qr-label")).toHaveAttribute("htmlFor", id);
        expect(screen.getByTestId("upload-qr-input")).toHaveAttribute("id", id)

    })
})


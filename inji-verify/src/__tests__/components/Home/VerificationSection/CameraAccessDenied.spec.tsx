import React from 'react';
import {fireEvent, render, screen} from "@testing-library/react";
import CameraAccessDenied from "../../../../components/Home/VerificationSection/CameraAccessDenied";

describe("CameraAccessDenied", () => {
    test("Open", () => {
        const handleCloseMock = jest.fn();
        render(<CameraAccessDenied open={true} handleClose={handleCloseMock}/>)
        expect(screen.getByText("Camera Access Denied")).toBeInTheDocument();
        expect(screen.getByText("We need your camera to scan the code. Go to your browser settings and allow camera access for this website.")).toBeInTheDocument();

        const iUnderstandButton = screen.getByTestId('i-understand-camera-access-denied');
        fireEvent.click(iUnderstandButton);

        expect(handleCloseMock).toHaveBeenCalled();
    })
})

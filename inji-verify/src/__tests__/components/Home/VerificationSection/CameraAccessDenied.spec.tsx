import React from 'react';
import {render, screen} from "@testing-library/react";
import CameraAccessDenied from "../../../../components/Home/VerificationSection/CameraAccessDenied";

describe("Camera access denied", () => {
    test("Test rendering", () => {
        const handlCloseMock = jest.fn();
        render(<CameraAccessDenied open={true} handleClose={handlCloseMock}/>)
        expect(screen.getByText("Camera Access Denied")).toBeInTheDocument()
        expect(screen.getByText("We need your camera to scan the code. Go to your browser settings and allow camera access for this website.")).toBeInTheDocument()
    })
})

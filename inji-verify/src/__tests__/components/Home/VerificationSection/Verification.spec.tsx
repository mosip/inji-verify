import React from 'react';
import {render, screen} from "@testing-library/react";
import Verification from "../../../../components/Home/VerificationSection/Verification";
import configureMockStore from "redux-mock-store";
import {VerificationSteps} from "../../../../utils/config";

jest.mock("../../../../redux/hooks", () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn()
}));

const mockStore = configureMockStore();
describe("Verification component", () => {
    test("Test loader", () => {
        const api = require("../../../../redux/hooks");
        api.useAppDispatch.mockReturnValue(jest.fn());
        api.useAppSelector.mockReturnValue(VerificationSteps.Verifying);

        render(<Verification/>)
        expect(screen.getByTestId("loader")).toBeInTheDocument()
    })

    test("Test loader", () => {
        const api = require("../../../../redux/hooks");
        api.useAppDispatch.mockReturnValue(jest.fn());
        api.useAppSelector.mockReturnValue(VerificationSteps.ActivateCamera);

        render(<Verification/>)
        // The following component is part of the QrScanner library that appears when waiting for camera access
        expect(screen.getByText("Loading ...")).toBeInTheDocument()
    })
})

import React from 'react';
import {render, screen} from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import Verification from "../../../../components/Home/VerificationSection/Verification";
import {VerificationSteps} from "../../../../utils/config";

jest.mock("../../../../redux/hooks", () => ({
    useAppDispatch: jest.fn()
}));

jest.mock("../../../../redux/features/verification/verification.selector", () => ({
    useVerificationFlowSelector: jest.fn()
}));

describe("Verification component", () => {
    test("Test loader - activate camera", () => {
        const api = require("../../../../redux/hooks");
        api.useAppDispatch.mockReturnValue(jest.fn());

        const verificationApi = require("../../../../redux/features/verification/verification.selector");
        verificationApi.useVerificationFlowSelector.mockReturnValue({activeScreen: VerificationSteps[method].ActivateCamera});

        act(() => {
            render(<Verification/>);
        });
        // The following component is part of the QrScanner library that appears when waiting for camera access
        expect(screen.getByText("Loading ...")).toBeInTheDocument()
    })
})

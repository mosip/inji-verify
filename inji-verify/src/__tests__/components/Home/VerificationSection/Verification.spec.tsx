import React from "react";
import {render, screen} from "@testing-library/react";
import * as ActiveStepContext from "../../../../hooks/useActiveStepContext";
import Verification from "../../../../components/Home/VerificationSection/Verification";

describe("Verification", () => {
    test("Verifying", () => {
        const setQrDataMock = jest.fn();
        let activeStep = 2;
        const useActiveStepContextMock = jest.spyOn(ActiveStepContext, 'useActiveStepContext')
            .mockImplementation(() => ({
                setActiveStep: (step) => {
                    activeStep = step;
                },
                getActiveStep: () => activeStep
            }));
        render(<Verification setQrData={setQrDataMock}/>)

        expect(screen.getByTestId('loader')).toBeInTheDocument()
    })
})

import React from 'react';
import {render, screen} from "@testing-library/react";
import InjiStepper from "../../../../components/Home/VerificationProgressTracker/InjiStepper";
import {VerificationSteps, VerificationStepsContent} from "../../../../utils/config";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();
const store = mockStore({activeScreen: VerificationSteps.ScanQrCodePrompt});

describe("Inji Stepper", () => {
    test("Test rendering", () => {
        render(
            <Provider store={store}>
                <InjiStepper/>
            </Provider>
        )

        VerificationStepsContent.forEach(step => {
            expect(screen.getByText(step.label)).toBeInTheDocument();
            if (typeof step.description === "string") {
                expect(screen.getByText(step.description)).toBeInTheDocument();
            }
        })
    })
})

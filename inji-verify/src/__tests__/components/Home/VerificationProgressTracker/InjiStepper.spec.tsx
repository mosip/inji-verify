import React from 'react';
import {render, screen} from "@testing-library/react";
import DesktopStepper from "../../../../components/Home/VerificationProgressTracker/DesktopStepper";
import {VerificationSteps, VerificationStepsContent} from "../../../../utils/config";
import {Provider} from "react-redux";
import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();
const store = mockStore({verification: {activeScreen: VerificationSteps.ScanQrCodePrompt}});

describe("Inji Stepper", () => {
    test("Test rendering", () => {
        render(
            <Provider store={store}>
                <DesktopStepper/>
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

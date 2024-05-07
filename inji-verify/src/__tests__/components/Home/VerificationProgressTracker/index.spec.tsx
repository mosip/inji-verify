import React from 'react';
import {render, screen} from "@testing-library/react";
import VerificationProgressTracker from "../../../../components/Home/VerificationProgressTracker";
import configureMockStore from "redux-mock-store";
import {Provider} from "react-redux";
import {VerificationStepsContent} from "../../../../utils/config";

const mockStore = configureMockStore();
const store = mockStore();

describe("Stepper Content Header", () => {
    test("Test rendering", () => {
        render(<Provider store={store}>
            <VerificationProgressTracker/>
        </Provider>)
        expect(screen.getByText("Verify credentials with ease!")).toBeInTheDocument();
        expect(screen.getByText(VerificationStepsContent[0].label)).toBeInTheDocument();
    })
})

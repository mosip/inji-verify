import React from 'react';
import {render, screen} from "@testing-library/react";
import StepperContentHeader from "../../../../components/Home/Header";

describe("Stepper Content Header", () => {
    test("Test rendering", () => {
        render(<StepperContentHeader/>)
        expect(screen.getByText("Verify credentials with ease!")).toBeInTheDocument()
    })
})


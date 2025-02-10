import React from 'react';
import {render, screen} from "@testing-library/react";
import StyledButton from "../../../../../components/Home/VerificationSection/commons/StyledButton";

describe("Styled Button", () => {
    test("Test rendering", () => {
        render(<StyledButton>
            A Styled Button
        </StyledButton>)
        expect(screen.getByText("A Styled Button")).toBeInTheDocument()
    })
})


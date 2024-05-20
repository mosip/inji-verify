import React from 'react';
import {render, screen} from "@testing-library/react";
import Copyrights from "../../../../components/Home/VerificationProgressTracker/Copyrights";

describe("Copyrights", () => {
    test("Test rendering", () => {
        render(<Copyrights/>)
        expect(screen.getByText("2024 © MOSIP - All rights reserved.")).toBeInTheDocument()
    })
})

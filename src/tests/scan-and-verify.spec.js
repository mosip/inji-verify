import {render, screen} from '@testing-library/react';
import PromptToScan from "../components/ScanAndVerify/PromptToScan.js";
import React from "react";

describe("Test Scan And Verify component", () => {
    test("Renders Scan prompt", () => {
        render(<PromptToScan setScanning={() => {console.log("Clicked on setScanning")}}/>);
        expect(screen.getByText("Scan QR code"))
            .toBeVisible();
    });
})

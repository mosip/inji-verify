import React from "react";
import {render, screen} from "@testing-library/react";
import VcDisplayCard from "../../../../../components/Home/VerificationSection/Result/VcDisplayCard";
import {SAMPLE_WEB_DID_VC as vc} from "../../../../../utils/samples";
import {convertToTitleCase, getDisplayValue} from "../../../../../utils/misc";


describe("Vc Display Card", () => {
    test("", () => {
        render(<VcDisplayCard vc={vc} setActiveStep={jest.fn()}/>);
        Object.keys(vc.credentialSubject)
            .filter(key => key?.toLowerCase() !== "id" && key?.toLowerCase() !== "type")
            .forEach(key => {
                expect(screen.getByText(convertToTitleCase(key))).toBeInTheDocument();
                expect(screen.getByText(getDisplayValue(vc.credentialSubject[key]))).toBeInTheDocument();
            })

    })
})

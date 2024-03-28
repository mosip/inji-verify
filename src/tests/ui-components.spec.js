import {render, screen} from '@testing-library/react';
import PromptToScan from "../components/ScanAndVerify/PromptToScan.js";
import React from "react";
import VerificationFailed from "../components/VerificationFailed/index.jsx";
import VerificationSuccess from "../components/VerificationSuccess/index.jsx";
import {convertToTitleCase, getDisplayValue} from "../utils/misc.js";

const sampleCred = {
    "id": "did:rcw:164f4b00-0141-40ef-b34a-5b9e1d5dfeca",
    "type": [
        "VerifiableCredential",
        "InsuranceCredential"
    ],
    "proof": {
        "type": "Ed25519Signature2020",
        "created": "2024-02-13T09:31:40Z",
        "proofValue": "z3acdb2TypHyxciB5AtB7Y4WJQBUVa3r6aZ7bdF2MNGgb3vuM57nSvY1xAkLJFn4C1bZ26qyprG1mNweyrENUeNCx",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f#key-0"
    },
    "issuer": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f",
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://holashchand.github.io/test_project/insurance-context.json",
        "https://w3id.org/security/suites/ed25519-2020/v1"
    ],
    "issuanceDate": "2024-02-13T09:31:40.464Z",
    "expirationDate": "2033-04-20T20:48:17.684Z",
    "credentialSubject": {
        "id": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f",
        "dob": "1968-10-25",
        "type": "InsuranceCredential",
        "email": "shreeram@gmail.com",
        "gender": "Male",
        "mobile": "0123456789",
        "benefits": [
            "Critical Surgery",
            "Full body checkup"
        ],
        "fullName": "Shreeram Theth",
        "policyName": "Start Insurance Gold Premium",
        "policyNumber": "1234567",
        "policyIssuedOn": "2023-04-20T20:48:17.684Z",
        "policyExpiresOn": "2033-04-20T20:48:17.684Z"
    }
}

describe("UI Components tests", () => {
    test("Renders Scan prompt", () => {
        render(<PromptToScan setScanning={() => {console.log("Clicked on setScanning")}}/>);
        expect(screen.getByText("Scan QR code"))
            .toBeVisible();
    });

    test("Renders Scan prompt", () => {
        render(<VerificationFailed setScanning={() => {console.log("Clicked on setScanning")}}/>);
        expect(screen.getByText("Certificate Invalid!"))
            .toBeVisible();
        expect(screen.getByRole("button"))
            .toBeVisible()
        expect(screen.getByText("Verify another certificate"))
            .toBeVisible()
    });

    test("Verification Success", () => {
        render(<VerificationSuccess back={() => {}} vc={sampleCred}/>)
        expect(screen.getByText("Certificate Successfully verified"))
            .toBeVisible()
        // Check whether all the credential subject properties are being displayed
        Object.keys(sampleCred.credentialSubject)
            .filter(key => key?.toLowerCase() !== "id" && key?.toLowerCase() !== "type")
            .forEach(key => {
                expect(screen.getByText(convertToTitleCase(key))).toBeVisible()
                expect(screen.getByText(getDisplayValue(sampleCred.credentialSubject[key]))).toBeVisible()
            })
    });
})

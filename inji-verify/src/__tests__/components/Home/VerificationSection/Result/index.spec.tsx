import React from 'react';
import {render, screen} from "@testing-library/react";
import Result from "../../../../../components/Home/VerificationSection/Result";
import {convertToTitleCase, getDisplayValue} from "../../../../../utils/misc";

jest.mock("../../../../../redux/hooks", () => ({
    useAppSelector: jest.fn(),
    useAppDispatch: jest.fn()
}))

let workingVc = {
    "id": "did:rcw:eb658f9b-879e-4628-8fcf-2fea22c5a522",
    "type": ["VerifiableCredential", "LifeInsuranceCredential", "InsuranceCredential"],
    "proof": {
        "type": "Ed25519Signature2020",
        "created": "2024-05-03T09:00:17Z",
        "proofValue": "z5vxkCcRt3DugiEwapFKKNuayHng4mHpLnwLKeeYSxR1eP6qVhehk59xXgi1pXvizv3JCUjavij3gkxVr7QGfCKZB",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:web:Sreejit-K.github.io:VCTest:0243cf3c-61c7-44fa-9685-213a422ad276#key-0"
    },
    "issuer": "did:web:Sreejit-K.github.io:VCTest:0243cf3c-61c7-44fa-9685-213a422ad276",
    "@context": ["https://www.w3.org/2018/credentials/v1", "https://holashchand.github.io/test_project/insurance-context.json", {"LifeInsuranceCredential": {"@id": "InsuranceCredential"}}, "https://w3id.org/security/suites/ed25519-2020/v1"],
    "issuanceDate": "2024-05-03T09:00:17.194Z",
    "expirationDate": "2024-06-02T09:00:17.174Z",
    "credentialSubject": {
        "id": "did:jwk:eyJrdHkiOiJFQyIsInVzZSI6InNpZyIsImNydiI6IlAtMjU2Iiwia2lkIjoiS0hjMFl0MjdxUGhQUUdGbkNYb1h2UjBvOU1uaWVzWGRsNk0zamUzMUZvWSIsIngiOiJrRDBhNUQzcl84cS1tQ0JSZUNCd2dsMFd6S0FqRTdSVlVHWU53c1Z0MnNrIiwieSI6IlA3VjVtcWpSMktEeGlmMENWVm1rN0xiWklfdVEzcTFab0JlU0E1Xy1vMlkiLCJhbGciOiJFUzI1NiJ9",
        "dob": "1968-12-24",
        "email": "abhishek@gmail.com",
        "gender": "Male",
        "mobile": "0123456789",
        "benefits": ["Critical Surgery", "Full body checkup"],
        "fullName": "Abhishek Gangwar",
        "policyName": "Start Insurance Gold Premium",
        "policyNumber": "1234567",
        "policyIssuedOn": "2023-04-20T20:48:17.684Z",
        "policyExpiresOn": "2033-04-20T20:48:17.684Z"
    }
};

let successVcStatus = {
    "status": "OK",
    "checks": [
        {
            "active": null,
            "revoked": "OK",
            "expired": "OK",
            "proof": "OK"
        }
    ]
}

let failureVcStatus = {
    "status": "NOK",
    "checks": [
        {
            "active": null,
            "revoked": "OK",
            "expired": "NOK",
            "proof": "NOK"
        }
    ]
}

describe("Vc Result", () => {
    test("VC Verification Successful", () => {
        const api = require("../../../../../redux/hooks")
        api.useAppSelector.mockReturnValue({vc: workingVc, vcStatus: successVcStatus});
        api.useAppDispatch.mockReturnValue(jest.fn());
        render(<Result/>)
        // Success message should appear
        expect(screen.getByText("Congratulations, the given credential is valid!")).toBeInTheDocument()
        // Verify VC property appearing on the screen
        expect(screen.getByText(convertToTitleCase("email"))).toBeInTheDocument()
        expect(screen.getByText(getDisplayValue(workingVc.credentialSubject.email))).toBeInTheDocument()
    })

    test("VC Verification Failure", () => {
        const api = require("../../../../../redux/hooks")
        api.useAppSelector.mockReturnValue({vc: undefined, vcStatus: failureVcStatus});
        api.useAppDispatch.mockReturnValue(jest.fn());
        render(<Result/>)
        // Success message should appear
        expect(screen.getByText("Unfortunately, the given credential is invalid!")).toBeInTheDocument()
    })
})

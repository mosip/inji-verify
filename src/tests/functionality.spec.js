import {convertToTitleCase, getDisplayValue} from "../utils/misc.js";

const did =     {
    "@context": [
        "https://www.w3.org/ns/did/v1"
    ],
    "id": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f",
    "alsoKnownAs": [],
    "service": [],
    "verificationMethod": [
        {
            "id": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f#key-0",
            "type": "Ed25519VerificationKey2020",
            "@context": "https://w3id.org/security/suites/ed25519-2020/v1",
            "controller": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f",
            "publicKeyMultibase": "z6MkwBN1HtfJrBXMtTsSH3HBgUJji3Z8vWTdVqoxshXzcJtP"
        }
    ],
    "authentication": [
        "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f#key-0"
    ],
    "assertionMethod": [
        "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f#key-0"
    ]
};

const VC = {
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
};

const did =     {
    "@context": [
        "https://www.w3.org/ns/did/v1"
    ],
    "id": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f",
    "alsoKnownAs": [],
    "service": [],
    "verificationMethod": [
        {
            "id": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f#key-0",
            "type": "Ed25519VerificationKey2020",
            "@context": "https://w3id.org/security/suites/ed25519-2020/v1",
            "controller": "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f",
            "publicKeyMultibase": "z6MkwBN1HtfJrBXMtTsSH3HBgUJji3Z8vWTdVqoxshXzcJtP"
        }
    ],
    "authentication": [
        "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f#key-0"
    ],
    "assertionMethod": [
        "did:abc:d1e50903-c0ee-42b2-abdf-74f68365759f#key-0"
    ]
};

describe("Functionality tests", () => {
    test("misc utils", () => {
        expect(convertToTitleCase("convertCamelCaseToTitleCase")).toBe("Convert Camel Case To Title Case");
        expect(getDisplayValue("display value")).toBe("display value");
        expect(getDisplayValue(["data1", "data2"])).toBe("data1, data2");
    })

    test("verification utils", async () => {
        // testing VC offline is not possible since resolving web did has some issues
        // web did resolver only supports https protocol by default which makes it difficult to resolve and test the verify functionality
        // let vcStatus = await verify(VC);
        // ex
    })
});

import React, {useState} from 'react';
import ScanAndVerify from "../components/ScanAndVerify";
import VerificationResult from "../components/VerificationResult.jsx";

function Home(props) {
    const [qrData, setQrData] = useState(undefined/*{
        text: '{\n' +
    '        "id": "did:abc:b7260e77-798d-4fbe-a388-ba395ed88b4c",\n' +
    '        "type": [\n' +
    '            "VerifiableCredential",\n' +
    '            "InsuranceCredential"\n' +
    '        ],\n' +
    '        "proof": {\n' +
    '            "type": "Ed25519Signature2020",\n' +
    '            "created": "2024-03-26T04:13:02Z",\n' +
    '            "proofValue": "z2AcpUpdA7wc69gvYSqjZCqT4BEp6CCEurFLf6xx2eDpEfAASb1S3tKQr7gSw14UKt6dNkBAgNpb5ZsHnT9dRFmoz",\n' +
    '            "proofPurpose": "assertionMethod",\n' +
    '            "verificationMethod": "did:abc:55acbc9d-4936-4a91-8071-ce2c0686276f#key-0"\n' +
    '        },\n' +
    '        "issuer": "did:abc:55acbc9d-4936-4a91-8071-ce2c0686276f",\n' +
    '        "@context": [\n' +
    '            "https://www.w3.org/2018/credentials/v1",\n' +
    '            {\n' +
    '                "@context": {\n' +
    '                    "id": "@id",\n' +
    '                    "schema": "https://schema.org/",\n' +
    '                    "@version": 1.1,\n' +
    '                    "@protected": true,\n' +
    '                    "InsuranceCredential": {\n' +
    '                        "@id": "did:InsuranceCredential",\n' +
    '                        "@context": {\n' +
    '                            "id": "@id",\n' +
    '                            "dob": "schema:birthDate",\n' +
    '                            "email": "schema:email",\n' +
    '                            "gender": "schema:gender",\n' +
    '                            "mobile": "schema:telephone",\n' +
    '                            "@version": 1.1,\n' +
    '                            "benefits": "schema:benefits",\n' +
    '                            "fullName": "schema:name",\n' +
    '                            "@protected": true,\n' +
    '                            "policyName": "schema:Text",\n' +
    '                            "policyNumber": "schema:Text",\n' +
    '                            "policyIssuedOn": "schema:DateTime",\n' +
    '                            "policyExpiresOn": "schema:expires"\n' +
    '                        }\n' +
    '                    }\n' +
    '                }\n' +
    '            },\n' +
    '            "https://w3id.org/security/suites/ed25519-2020/v1"\n' +
    '        ],\n' +
    '        "issuanceDate": "2024-03-26T04:13:02.097Z",\n' +
    '        "expirationDate": "2024-04-31",\n' +
    '        "credentialSubject": {\n' +
    '            "id": "did:1234",\n' +
    '            "dob": "1996-09-02",\n' +
    '            "type": "InsuranceCredential",\n' +
    '            "gender": "Male",\n' +
    '            "benefits": [\n' +
    '                "benefit 1"\n' +
    '            ],\n' +
    '            "fullName": "name",\n' +
    '            "policyName": "policy1",\n' +
    '            "policyNumber": "123",\n' +
    '            "policyIssuedOn": "2024-03-13",\n' +
    '            "policyExpiresOn": "2024-04-31"\n' +
    '        }\n' +
    '    }\n'
    }*/);
    return qrData
        ? (<VerificationResult qrData={qrData} back={() => setQrData(null)}/>)
        : (<ScanAndVerify readQrData={setQrData}/>);
}

export default Home;

# Revocation 

As of version `1.6.0` The Inji verify supports verification of `Revoked` vc. Revocation is a mechanism used by an issuer to express the status of a Claim after issuance. 

# Why is VC Revocation needed?

In a `Verifiable Credential` (VC), once it’s issued, it’s cryptographically signed and can be verified even offline.

But what happens if the credential later becomes invalid? For example:
- A driver’s license is revoked
- A student’s degree is withdrawn
- An employment certificate is expired or suspended

We need a way to check if the VC is still valid — without reissuing it.
That’s where the `credentialStatus` property comes in.
It points to a `status list` or registry maintained by the issuer, where verifiers can check whether the credential has been `revoked`, `suspended`, or otherwise invalidated.

## API Documentation

The API documentations can be found [here](https://mosip.stoplight.io/docs/inji-verify/branches/main/)

## Functionalities 

## 1. UPLOAD & SCAN

###  Verifiable Credential Submission:
- Inji Verify have API to submit Verifiable Credential.

> **Note** that Verifiable Credential Submission endpoint(`/vc-submission`) is specifically for submitting individual credentials and is distinct from a Verifiable Presentation (VP) submission.

- Once the verifier scans the QR code, it decodes the QR code using `pixel_pass_library` and post it to the Inji Verify backend (db).

- A typical JSON-LD Revoked Verifiable Credential includes a field like this:

    ```json
    "credentialStatus": {
    "id": "https://example.org/status/24#94567",
    "type": "StatusList2021Entry",
    "statusPurpose": "revocation",
    "statusListIndex": "94567",
    "statusListCredential": "https://example.org/status/24"
    }
    ```

- Field-by-Field Explanation

| Field                 | Meaning                                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------------------|
| id                    | A unique URL identifier for this status entry.                                                             |
| type                  | The method used for status checking — e.g., `BitstringStatusListEntry`.                                   |
| statusPurpose         | Describes why this status exists — e.g., "revocation" or "suspension".                                     |
| statusListIndex       | A numeric index (or bit position) representing this credential’s position in the status list.             |
| statusListCredential  | The URI of the status list credential — a VC published by the issuer that contains a compressed bitstring. |

###  Submission Result:

- Inji verify UI can fetch the result of the submission through APIs.

- This API performs server-side verification of a Verifiable Credential (VC) to validate its integrity and authenticity. It executes checks such as cryptographic signature validation and ensures that the credential has not been altered or tampered with.

    > ### How it check for revocation
    >    
    > - **_Issuer_** : assigns each new credential a statusListIndex and puts that index into the VC’s credentialStatus object.
    > 
    > - **_Inji Verify Banckend_** : retrieves the `statusListCredential`, decodes its encodedList, checks the bit at that index to see whether it’s revoked/suspended.

- The verification status returned can be **_SUCCESS_**, **_INVALID_**, **_EXPIRED_** or **_REVOKED_**.

- If the Inji Verify Backend encounters any error while retrieving the `statusListCredential` or verifing the status, it will post the error back to the Verify UI along with an error description and `status code` as `500`.


## 2. OPENID4VP

###  Verifiable Presentation Submission:

- Inji Verify have API to submit Verifiable Presentation.
- Once the wallet scans the QR code, it generates the VP token and the submission request, which are then posted to the Inji Verify backend.
- If the wallet encounters any error while generating the VP token, it will post the error back to the Inji Verify backend along with an error description.

> **Important Implementation Note:**
> The endpoint can return a **_redirect_uri_** based on the **_INJI_VERIFY_REDIRECT_URI_** configuration.
>
> If **_INJI_VERIFY_REDIRECT_URI_** is blank, no **_redirect_uri_** is returned.
>
> This minimal feature implementation is intended to support integration with specific modules (e.g., wallets and verifier applications). Full implementation, including response_code support, is planned for future releases to ensure complete compliance with the OpenID4VP specification.

###  Submission Result:
- Once the wallet submits the VC, The status will be changed to **_VP_SUBMITTED_**.
- Inji verify UI can fetch the result of the submission through APIs. The result will contain two things.
  - Overall status of submission, either its **_SUCCESS_** or **_FAILED_**
  - List of VC with its own verification status, it can be 
  * **_SUCCESS_** 
  * **_INVALID_** 
  * **_EXPIRED_**
  * **_REVOKED_**
- During the revocation check, any error encountered by the vc_verifier will result in an exception containing a descriptive error message, which the Verify UI will display to the user.
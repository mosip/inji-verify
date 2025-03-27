# OpenID4VP - Partial Sharing Of Verifiable Credential


- Inji Verify will generate a QR code with authorization request for selected VCs, which is created and obtained from Inji Verify backend. 
- Inji verify Ui will make a request to backend to create the authorization request and the UI will render this as a QR code for the wallet to scan.
- Once the wallet scans the QR code, wallet generates the VP token and submission request. This will be posted to the Inji verify backend.
- Once the wallet submits the VC, The status will be changed to **_VP_SUBMITTED_**.
- Inji verify UI can fetch the result of the submission through APIs. The result will contain two things.
  - Overall status of submission, either its **_SUCCESS_** or**_INVALID_**
  - List of VC with its own verification status.
- Inji verify UI checks the result of the submission and matches against the selected claims. If any requested VC is missing user is given option to request missing VCs
- Upon initiating same flow the missing VCs will be re requested


## Sequence Diagram
```mermaid    
sequenceDiagram
    participant Verify Backend
    participant Verify UI
    participant Wallet


    Verify UI->>Verify Backend: 1. Create a Autherization Request
    Verify Backend--)Verify Backend: 2. Process the request,<br> create and return Autherization Request response
    Verify Backend->>Verify UI: 3. Autherization Request Response
    Verify UI--)Verify UI: 4. Generate QR Code with response
    Verify UI--)Verify UI: 5. Polling Status BACKEND_URL/vp-request/${reqId}/status (ACTIVE, VP_SUBMITTED, EXPIRED)
    Wallet--)Wallet: 6. Scan QR Code
    Wallet--)Wallet: 7. Process the QR Data and List the matching VC's
    Wallet->>Verify Backend: 8.Submits VP Token
    Verify Backend--)Verify UI: 9. Status == VP_SUBMITTED
    Verify UI->>Verify Backend: 10. Fetch Submission result
    Verify Backend->>Verify UI: 11. Return Submission result
    Verify UI--)Verify UI: 12. Check for missing VC from requested VCs
    Verify UI--)Verify UI: 13. Render Submited VC and its statuses accordingly
    Verify UI--)Verify UI: 14. Initiate `REQUEST MISSING VC` flow
    Verify UI--)Verify UI: 15. Create a presentation definition with missing VCs, and trigger from STEP : 1
```
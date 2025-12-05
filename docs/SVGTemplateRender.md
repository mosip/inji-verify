# SVG Template Rendering

As of version **`1.6.0`**, **Inji Verify also supports SVG Template Rendering**.  
This feature allows issuers to define **custom look-and-feel**, **layout**, and **presentation order** for their Verifiable Credentials.

With this capability, issuers can ensure that the credential rendered to the user matches their branding and visual requirements.

---

# Why SVG Template Rendering?

By default, credentials are rendered in a generic UI format.  
However, some issuers may want:

- A specific layout  
- Custom fonts, colors, and styling  
- A visual certificate-like look  
- Logos, seals, decorative frames  
- A fixed ordering of fields  

To support this, issuers can embed a **rendering instruction** inside the VC that points to a **hosted SVG template**.

---

# How Issuers Include a Template

Issuers embed a `renderMethod` object inside the credential:

```json
"renderMethod": {
  "template": {
    "id": "https://issuer.example.org/templates/vc-template-01.svg"
  }
}
```

Field-by-Field Explanation

| Field                 | Meaning                                                                                                   |
|-----------------------|-----------------------------------------------------------------------------------------------------------|
| renderMethod          | Parent object describing how to render the VC                                                             |
| template              | Specifies a template-based rendering approach                                                             |
| id                    | URL pointing to the SVG template stored by the issuer                                                     |

The `issuer` must host and maintain the `SVG template` on their server or template store.

---

## Functionalities 

### How Inji Verify Renders SVG Templates

When a credential is ready to be displayed, Inji Verify performs the following steps:

- `Inji verify UI` can fetch the result of the submission through APIs, and validate it using `vc-verifier` and returns the response

- `Inji Verify UI` renders the response accordingly:

1. For `JSON VC` (already decoded) → Render directly

   - If the verified credential includes a `renderMethod` with an `SVG template` reference, Inji Verify fetches the `SVG template` from the `issuer`, preprocesses the VC for language and placeholder handling, and renders the credential in `SVG format` using the `VCRenderer`. The sanitized SVG is then displayed in the interface.

   - If `SVG template rendering fails` for any reason (missing template, fetch failure, invalid SVG, rendering error, or empty output), Inji Verify automatically falls back to showing the credential in the standard key–value layout using its `default UI components`.

   - This ensures that credential display is always reliable—using SVG rendering and falling back to the structured key–value view when SVG is unavailable.

2. For `SD-JWT VC` in encoded string format → Must be decoded using `@sd-jwt/decode`

   - Since `SD-JWT` credentials do not contain a `renderMethod`. These credentials are always displayed in the `default key–value layout`.

3. Or shows `error messages` and failure details if the `verification failed`.
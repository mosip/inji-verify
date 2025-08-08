## 📦 Installation for Development

If you want to contribute or modify the SDK:

```bash
# Clone and install dependencies
npm install

# Build the project
npm run build

# Publish locally with Verdaccio
npm publish --registry http://localhost:4873
```

## 🔍 Testing Your Integration

1. **Test QR Scanning:** Use a QR code generator to create test codes
2. **Test File Upload:** Try uploading PNG, JPEG, or PDF files
3. **Test Error Handling:** Disconnect your backend and see if errors are handled
4. **Test Expiration:** Let QR codes expire to test timeout handling
5. **Test Mobile:** Ensure camera permissions work on mobile devices

## 🤝 Support

- For technical questions: Check the [OpenAPI specification](https://openid.net/specs/openid-4-verifiable-presentations-1_0-ID3.html)
- For backend setup: See the `inji-verify-service` documentation
- For React help: Refer to React's official documentation
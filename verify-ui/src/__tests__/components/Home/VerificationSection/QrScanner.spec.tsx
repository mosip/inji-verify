import React from "react";
import { render } from "@testing-library/react";
import QrScanner from "../../../../components/Home/VerificationSection/QrScanner";

const mockDispatch = jest.fn();
let onError: ((error: unknown) => void) | undefined;

jest.mock("../../../../redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

jest.mock("../../../../utils/commonUtils", () => ({
  getClientId: jest.fn().mockReturnValue("client-id"),
  isVPSubmissionSupported: jest.fn().mockReturnValue(false),
  vcVerificationV2Request: {},
  getQrErrorMessage: jest.fn((error: { message?: string } | null) =>
    (error && typeof error === "object" && error.message) || "generic failure"
  ),
}));

jest.mock("@injistack/react-inji-verify-sdk", () => ({
  QRCodeVerification: ({ onError: errorHandler }: { onError: (error: unknown) => void }) => {
    onError = errorHandler;
    return <div data-testid="qr-code-verification" />;
  },
}));

describe("QrScanner", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    onError = undefined;
  });

  test("shows the error message when a scan fails", () => {
    render(<QrScanner onClose={jest.fn()} scannerActive />);

    onError?.(new Error("No matching credentials found to fulfill the request"));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          message: "No matching credentials found to fulfill the request",
          severity: "error",
        }),
      }),
    );
  });

  test("shows the generic message when a scan error has no usable text", () => {
    render(<QrScanner onClose={jest.fn()} scannerActive />);

    onError?.(null);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          message: "generic failure",
        }),
      }),
    );
  });
});

// match fot the occurrence of an uppercase letter
import i18next from "i18next";
import { VerificationMethod, VerificationStepsContentType } from "../types/data-types";
import {
  InternetConnectivityCheckTimeout,
  InternetConnectivityCheckEndpoint,
  getVerificationStepsContent,
} from "./config";

const splitCamelCaseRegex: RegExp = /([A-Z][a-z]+)/g;

// match if the first char is lower case
const lowercaseStartRegex: RegExp = /^([a-z])/;

export const convertToTitleCase = (text: string): string => {
    if (!text) return "";
    return text
        // Once match is found, split the words by adding space at the beginning of the natch and ensure the first letter is capital
        .replaceAll(splitCamelCaseRegex, (match) => ` ${match.charAt(0).toUpperCase()}${match.slice(1)}`)
        // convert the first char of 'text' to capital case
        .replace(lowercaseStartRegex, (match) => match.toUpperCase());
};

export const getDisplayValue = (data: any): string => {
    if (Array.isArray(data) && data?.length > 0) {
        let displayValue = "";
        for (const value of data) {
            displayValue += `${value}, `;
        }
        return displayValue.slice(0,- 2);
    }
    return data?.toString();
}

export const fetchVerificationSteps = (
  method: VerificationMethod,
  isPartiallyShared: boolean,
  flowType?: "sameDevice" | "crossDevice",
  activeScreen: number = 1 // default to first step if not passed
) => {
  
  let VerificationStepsContent: VerificationStepsContentType = getVerificationStepsContent();

  if (method !== "VERIFY") {
    return VerificationStepsContent[method].map((step, index) => ({
      ...step,
      stepNumber: index + 1,
      isCompleted: index + 1 < activeScreen,
      isActive: index + 1 === activeScreen,
    }));
  }

  const verifySteps = VerificationStepsContent.VERIFY;
  const stepMap = Object.fromEntries(verifySteps.map((step) => [step.label, step]));

  const selectedSteps = [];

  selectedSteps.push(
    stepMap[i18next.t("VerificationStepsContent:VERIFY.InitiateVpRequest.label")]
  );

  if (isPartiallyShared) {
    selectedSteps.push(
      stepMap[i18next.t("VerificationStepsContent:VERIFY.RequestMissingCredential.label")]
    );
  } else {
    selectedSteps.push(
      stepMap[i18next.t("VerificationStepsContent:VERIFY.SelectCredential.label")]
    );
  }

  if (flowType === "sameDevice") {
    selectedSteps.push(
      stepMap[i18next.t("VerificationStepsContent:VERIFY.SelectWallet.label")]
    );
  } else {
    selectedSteps.push(
      stepMap[i18next.t("VerificationStepsContent:VERIFY.ScanQrCode.label")]
    );
  }

  selectedSteps.push(
    stepMap[i18next.t("VerificationStepsContent:VERIFY.DisplayResult.label")]
  );

  return selectedSteps
    .filter(Boolean)
    .map((step, index) => ({
      ...step,
      stepNumber: index + 1,
      isCompleted: index + 1 < activeScreen,
      isActive: index + 1 === activeScreen,
    }));
};

export const getRangeOfNumbers = (length: number): number[] => {
    return Array.from(new Array(length), (x, i) => i + 1);
}

export const getFileExtension = (fileName: string) => fileName.slice(
    ((fileName.lastIndexOf('.') - 1) >>> 0) + 2
);

export const checkInternetStatus = async (): Promise<boolean> => {
    if (!globalThis.navigator.onLine) return false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort()
    }, InternetConnectivityCheckTimeout);
    try {
        // Try making an api call if the window.navigator.onLine is true
        await fetch(InternetConnectivityCheckEndpoint, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/plain'
            },
            signal: controller.signal
        }); // Use a reliable external endpoint
        return true;
    } catch (error) {
        console.error("Error occurred while checking for internet connectivity: ", error);
        return false; // Network request failed, assume offline
    } finally {
        clearTimeout(timeoutId);
    }
}

export const convertToId = (content: string) => content.toLowerCase().replaceAll(" ", "-");

export const saveData = async (vc: any) => {
  const myData = vc;
  const fileName = vc.type ? vc?.type[1] : "Inji_Verify_Credential_Data";
  const json = JSON.stringify(myData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
};

import { useTranslation } from "react-i18next";

const useVerificationStepsContent = () => {
  const { t } = useTranslation("VerificationStepsContent");

  const VerificationStepsContent = {
    SCAN: [
      {
        label: t("SCAN.QrCodePrompt.label"),
        description: t("SCAN.QrCodePrompt.description"),
      },
      {
        label: t("SCAN.ActivateCamera.label"),
        description: t("SCAN.ActivateCamera.description"),
      },
      {
        label: t("SCAN.Verifying.label"),
        description: t("SCAN.Verifying.description"),
      },
      {
        label: t("SCAN.DisplayResult.label"),
        description: t("SCAN.DisplayResult.description"),
      },
    ],
    UPLOAD: [
      {
        label: t("UPLOAD.QrCodePrompt.label"),
        description: t("UPLOAD.QrCodePrompt.description"),
      },
      {
        label: t("UPLOAD.Verifying.label"),
        description: t("UPLOAD.Verifying.description"),
      },
      {
        label: t("UPLOAD.DisplayResult.label"),
        description: t("UPLOAD.DisplayResult.description"),
      },
    ],
  };

  return VerificationStepsContent;
};

export default useVerificationStepsContent;

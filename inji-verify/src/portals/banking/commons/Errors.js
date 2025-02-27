import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

/**
 * @param {string} errorCode is a key from locales file under errors namespace
 * @param {string} errorMsg (Optional) is a fallback value if transaction for errorCode not found.
 * If errorMsg is not passed then errorCode key itself became the fallback value.
 */

const Error = ({
  errorCode,
  errorMsg,
  i18nKeyPrefix = "errors",
  showToast = false,
}) => {
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });
  const [errorBanner, setErrorBanner] = useState(true);

  useEffect(() => {
    if (showToast) {
      toast.error(t(errorCode, errorMsg));
    }
  }, []);

  const handleCross = () => {
    setErrorBanner(false);
  };

  return (
    errorBanner && (
      <div
        className="p-4 w-full mb-4 text-sm dark:bg-red-500 dark:text-white flex justify-between"
        role="alert"
      >
        <span className="text-white font-normal xl:pl-[2rem] px-0">
          {t(errorCode, errorMsg)}
        </span>
        <img
          src="assets/images/close_icon.svg"
          alt="close"
          className="md:mr-[2rem] hover:cursor-pointer"
          onClick={handleCross}
        />
      </div>
    )
  );
};

export { Error };

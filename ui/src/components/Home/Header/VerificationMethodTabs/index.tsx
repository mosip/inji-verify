import React, { useRef } from "react";
import { useAppDispatch } from "../../../../redux/hooks";
import { useVerificationFlowSelector } from "../../../../redux/features/verification/verification.selector";
import { goToHomeScreen } from "../../../../redux/features/verification/verification.slice";
import { VerificationMethod } from "../../../../types/data-types";
import { raiseAlert } from "../../../../redux/features/alerts/alerts.slice";
import { AlertMessages } from "../../../../utils/config";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";

const Tab = ({
  id,
  active,
  label,
  disabled,
  onClick,
}: {
  id: string;
  active: boolean;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  const activeTab =
    "bg-gradient border-t-[6px] border-y-transparent text-activeTabText";
  const inactiveTab =
    "bg-inactiveTabBackground text-inactiveTabText";
  const disabledTab = "text-disableTabText bg-disableTabBackground";
  const enabledTab = active ? activeTab : inactiveTab;
  return (
    <div>
      <button
        id={id}
        className={`w-[172px] lg:w-[214px] py-4 focus:outline-none self-end rounded-t-xl shadow-xl shadow-[0_2px_6px_0] ${
          disabled ? disabledTab : enabledTab
        }`}
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

function VerificationMethodTabs(props: any) {
  const dispatch = useAppDispatch();
  const method = useVerificationFlowSelector((state) => state.method);

  function switchToVerificationMethod(method: VerificationMethod) {
    dispatch(goToHomeScreen({ method }));
  }

  function showAlert() {
    dispatch(
      raiseAlert({ ...AlertMessages.verificationMethodComingSoon, open: true })
    );
  }

  const carouselRef: any = useRef<HTMLDivElement>();

  const handlePrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto w-[100%] bg-lighter-gradient  max-w-[100vw] overflow-x-hidden lg:overflow-x-auto">
      <div className="flex flex-row items-center mx-auto justify-center relative">
        <div className="absolute left-0 h-full w-12 bg-arrowBackGround md:hidden grid items-center">
          <button
            id="tabs-carousel-left-icon"
            onClick={handlePrevious}
            className="focus:outline-none"
          >
            <MdArrowBackIos className="mx-auto" />
          </button>
        </div>
        <div
          className="flex w-[calc(100vw-96px)] md:w-full mx-auto overflow-x-scroll md:overflow-x-auto"
          ref={carouselRef}
        >
          <div className="flex space-x-0.5 border-gray-200 font-bold items-end mx-auto lg:justify-center">
            <Tab
              id="upload-qr-code-tab"
              active={method === "UPLOAD"}
              label="Upload QR Code"
              onClick={() => switchToVerificationMethod("UPLOAD")}
            />
            <Tab
              id="scan-qr-code-tab"
              active={method === "SCAN"}
              label="Scan the QR Code"
              onClick={() => switchToVerificationMethod("SCAN")}
            />
            <Tab
              id="vp-verification-tab"
              active={false}
              label="VP Verification"
              disabled
              onClick={showAlert}
            />
            <Tab
              id="ble-tab"
              active={false}
              label="BLE"
              disabled
              onClick={showAlert}
            />
          </div>
        </div>
        <div className="absolute right-0 h-full w-12 bg-arrowBackGround md:hidden grid items-center">
          <button
            id="tabs-carousel-right-icon"
            onClick={handleNext}
            className="focus:outline-none"
          >
            <MdArrowForwardIos className="mx-auto" />
          </button>
        </div>
      </div>
      <div id="horizontalLine" className="bg-gradient h-[3px] border-b-2 border-b-transparent" />
    </div>
  );
}

export default VerificationMethodTabs;

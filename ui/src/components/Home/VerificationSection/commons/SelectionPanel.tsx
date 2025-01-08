import React, { useEffect } from "react";
import MobileStepper from "../../VerificationProgressTracker/MobileStepper";
import { resetVpRequest } from "../../../../redux/features/verify/vpVerificationState";
import { useAppDispatch } from "../../../../redux/hooks";
import SelectionPanelContent from "./SelectionPanelContent";

const DesktopModal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed z-10 inset-0 flex items-center justify-center">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="relative bg-white max-w-[80vw] p-6 rounded-lg shadow-xl">
      {children}
    </div>
  </div>
);

const SlideModal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-50 overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="relative w-full h-full">
      <div className="slide-up-container">{children}</div>
    </div>
  </div>
);

const SelectionPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const HandelBack = () => {
    dispatch(resetVpRequest());
  };
  return (
    <div>
      {/* Mobile View */}
      <div className="block lg:hidden">
        <SlideModal>
          <div className="flex justify-center">
            <div
              className="w-10 h-1 bg-[#404653] rounded-full my-2 cursor-pointer"
              onClick={HandelBack}
            />
          </div>
          <div className="pt-2">
            <MobileStepper />
          </div>
          <SelectionPanelContent />
        </SlideModal>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DesktopModal>
          <SelectionPanelContent />
        </DesktopModal>
      </div>
    </div>
  );
};

export default SelectionPanel;

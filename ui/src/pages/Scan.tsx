import React from "react";
import PageTemplate from "../components/PageTemplate";
import VerificationSection from "../components/Home/VerificationSection";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";

export const Scan = () => {
  return (
    <PageTemplate>
      <div className="grid grid-cols-12">
        <div className="col-start-1 col-end-13 lg:col-start-1 lg:col-span-6 lg:bg-pageBackGroundColor xs:w-[100vw] lg:max-w-[50vw] pb-[100px]">
          <VerificationProgressTracker />
        </div>
        <div className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 xs:[100vw] lg:max-w-[50vw]">
          <VerificationSection />
        </div>
      </div>
    </PageTemplate>
  );
};

import React, { useState } from "react";
import PageTemplate from "../components/PageTemplate";
import VerificationProgressTracker from "../components/Home/VerificationProgressTracker";
import { VpVerification } from "../components/Home/VerificationSection/VpVerification";
import SelectionPannel from "../components/Home/VerificationSection/commons/SelectionPannel";
import { Button } from "../components/Home/VerificationSection/commons/Button";

export function Verify() {
  const [openSelection,setSelection] = useState(false)
  return (
    <PageTemplate>
      <div className="grid grid-cols-12">
        <div className="col-start-1 col-end-13 lg:col-start-1 lg:col-span-6 lg:bg-pageBackGroundColor xs:w-[100vw] lg:max-w-[50vw]">
          <VerificationProgressTracker />
          <Button
            id="request-credentials-button"
            title="Request Credentials"
            className="text-center inline-flex absolute top-[650px] left-[80px] w-[300px]"
            onClick={()=>setSelection(!openSelection)}
          />
          {
            <SelectionPannel
              open={openSelection}
              handleClose={()=>setSelection(!openSelection)}
            />
          }
        </div>
        <div className="col-start-1 col-end-13 lg:col-start-7 lg:col-end-13 xs:[100vw] lg:max-w-[50vw]">
          <VpVerification />
        </div>
      </div>
    </PageTemplate>
  );
}

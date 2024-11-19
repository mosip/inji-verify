import React, { useEffect, useState } from "react";
import { QrIcon, ScanOutline } from "../../../utils/theme-utils";
import { QRCodeSVG } from "qrcode.react";
import { useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import { useAppDispatch } from "../../../redux/hooks";
import { getRequestUri } from "../../../redux/features/verify/verifyState";
import Loader from "../../commons/Loader";

export const VpVerification = () => {
  const dispatch = useAppDispatch();
  const [isQrcode, setQrCode] = useState(false);
  const qrSize = window.innerWidth <= 1024 ? 250 : 320;
 
  const isLoading = useVerifyFlowSelector((state) => state.isLoading);
  const RequestUri = useVerifyFlowSelector((state) => state.requestUri);

  
  useEffect(() => {
    dispatch(getRequestUri());
  }, [dispatch]);

  return (
    <div className="flex justify-center h-full lg:h-auto">
      {isLoading ? (
        <div className="relative lg:top-[200px] border">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-col mt-10 lg:mt-0 pt-0 pb-[100px] lg:py-[42px] px-0 lg:px-[104px] text-center content-center justify-center">
            <div className="xs:col-end-13">
              <div
                className={`relative grid content-center justify-center w-[275px] h-auto lg:w-[360px] aspect-square my-1.5 mx-auto bg-cover`}
                style={{ backgroundImage: `url(${ScanOutline})` }}
              >
                {!isQrcode ? (
                  <>
                    <div className="grid bg-lighter-gradient rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center"></div>
                    <div className="absolute top-[58px] left-[98px] lg:top-[165px] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
                      <QrIcon className="w-[78px] lg:w-[100px]" />
                    </div>
                  </>
                ) : (
                  <>
                    {RequestUri && (
                      <QRCodeSVG
                        value={RequestUri}
                        size={qrSize} // Size of the QR code
                        bgColor="#ffffff" // Background color
                        fgColor="#000000" // Foreground color
                        level="L" // Error correction level ('L', 'M', 'Q', 'H')
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
};

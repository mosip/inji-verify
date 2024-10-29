import React, { useEffect, useState } from "react";
import { QrIcon, ScanOutline } from "../../../utils/theme-utils";
import StyledButton from "./commons/StyledButton";
import { QRCodeSVG } from "qrcode.react";
import { useVerifyFlowSelector } from "../../../redux/features/verification/verification.selector";
import { useAppDispatch } from "../../../redux/hooks";
import { getRequestUri } from "../../../redux/features/verify/verifyState";
import Loader from "../../commons/Loader";
import { verifiableClaims } from "../../../utils/config";

interface GenerateButtonProps {
  onPress: () => void;
  disable: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onPress,
  disable,
}) => {
  return (
    <StyledButton
      id="generate-qr-code-button"
      className="mx-0 my-1.5 text-center inline-flex absolute top-[100px] left-[-63px] w-[205px] lg:w-[223px] lg:left-[-68px] lg:top-[115px]"
      fill={false}
      onClick={onPress}
      disabled={disable}
    >
      Generate QR Code
    </StyledButton>
  );
};

export const VpVerification = () => {
  const dispatch = useAppDispatch();
  const [claim, setClaims] = useState("");
  const [isQrcode, setQrCode] = useState(false);
  const claimOptions = verifiableClaims;
  const qrSize = window.innerWidth <= 1024 ? 250 : 320;
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClaim = event.target.value;
    setClaims(selectedClaim);
  };
  const isLoading = useVerifyFlowSelector((state) => state.isLoading);
  const RequestUri = useVerifyFlowSelector((state) => state.requestUri);

  const HandelBack = () => {
    dispatch(getRequestUri());
    setQrCode(false);
    setClaims("");
  };

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
          <select
            className="absolute mb-5 mt-2 border border-2 border-primary rounded-[5px]"
            name="selectClaim"
            id="claimType"
            onChange={handleSelectChange}
            disabled={isQrcode}
          >
            <option value="">Select Claim Type</option>
            {claimOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
                      <GenerateButton
                        onPress={() => setQrCode(true)}
                        disable={!claim}
                      />
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
            {isQrcode && (
              <div className="col-span-12">
                <StyledButton
                  id="verification-back-button"
                  className="w-[100px] lg:w-[350px] mt-[18px] mx-0 my-1.6 text-lgNormalTextSize inline-flex"
                  onClick={HandelBack}
                >
                  Back
                </StyledButton>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

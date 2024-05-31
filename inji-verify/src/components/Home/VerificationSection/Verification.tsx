import React from 'react';
import scanQr from "../../../assets/scanner-ouline.svg";
import Loader from "../../commons/Loader";
import QrScanner from "./QrScanner";
import StyledButton from "./commons/StyledButton";
import {useAppDispatch} from "../../../redux/hooks";
import {goHomeScreen} from "../../../redux/features/verification/verification.slice";
import {VerificationSteps} from "../../../utils/config";
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";

const Verification = () => {
    const dispatch = useAppDispatch();
    const activeScreen = useVerificationFlowSelector(state => state.activeScreen);
    console.log({activeScreen})

    return (
        <div className="grid mx-auto pt-1 pb-[100px] px-[16px] md:py-[78px] md:px-[104px] text-center content-center justify-center">
            <div className="col-end-12 font-bold text-xl  mb-11">
                <p className="font-bold text-[19px] md:text-[26px] mb-2">
                    Position QR Code
                </p>
                <p className="font-normal text-[14px] md:text-[16px] text-center overflow-visible">
                    Hold up the document or card with the QR code in front of your camera and ensure the QR code is within the camera frame to initiate verification.
                </p>
            </div>
            <div className="col-end-12">
                <div className="grid w-[100%] md:w-[350px] aspect-square max-w-[280px] md:max-w-none bg-cover content-center justify-center m-auto" style={{
                    backgroundImage: `url(${scanQr})`
                }}>
                    {
                        activeScreen === VerificationSteps.Verifying
                            ? (<Loader/>)
                            : (<QrScanner/>)
                    }
                </div>
            </div>
            <div className="col-end-12">
                <StyledButton
                    className="w-[100%] md:w-[350px] max-w-[280px] md:max-w-none mt-[18px]"
                    onClick={() => {dispatch(goHomeScreen({}))}}>
                    Back
                </StyledButton>
            </div>
        </div>
    );
}

export default Verification;

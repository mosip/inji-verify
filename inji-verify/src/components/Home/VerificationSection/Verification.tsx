import React from 'react';
import scanQr from "../../../assets/scanner-ouline.svg";
import Loader from "../../commons/Loader";
import QrScanner from "./QrScanner";
import StyledButton from "./commons/StyledButton";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {goHomeScreen} from "../../../redux/features/verification/verification.slice";
import {VerificationSteps} from "../../../utils/config";
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";

const Verification = () => {
    const dispatch = useAppDispatch();
    const activeScreen = useVerificationFlowSelector(state => state.activeScreen);
    console.log({activeScreen})

    return (
        <div className="grid mx-auto py-1 px-[60px] md:py-[78px] md:px-[104px] text-center content-center justify-center">
            <div className="col-end-12 font-bold text-xl  mb-11">
                <p className="font-bold text-xl mb-2">
                    Verification in Progress
                </p>
                <p className="font-normal text-[16px] text-center overflow-visible">
                    This verification will take sometime, please don’t close the browser.
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

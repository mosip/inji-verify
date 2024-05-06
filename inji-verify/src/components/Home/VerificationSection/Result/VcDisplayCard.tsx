import React from 'react';
import {convertToTitleCase, getDisplayValue} from "../../../../utils/misc";
import StyledButton from "../commons/StyledButton";
import {ReactComponent as DocumentIcon} from '../../../../assets/document.svg';
import {useAppDispatch} from "../../../../redux/hooks";
import {goHomeScreen} from "../../../../redux/features/verification/verificationSlice";

function VcDisplayCard({vc}: {vc: any}) {
    const dispatch = useAppDispatch();
    return (
        <div>
            <div className={`grid xs:w-[90vw] md:w-[400px] m-auto bg-white rounded-[12px] py-[5px] px-[15px] max-h-[320px] shadow-lg ${vc ? "overflow-y-scroll" : ""}`}>
                {
                    vc ? Object.keys(vc.credentialSubject)
                        .filter(key => key?.toLowerCase() !== "id" && key?.toLowerCase() !== "type")
                        .map((key, index) => (
                            <div className={`py-2.5 px-1 xs:col-end-13 ${(index % 2 === 0) ? "md:col-start-1 md:col-end-6" : "md:col-start-8 md:col-end-13"}`} key={key}>
                                <p className="font-normal font-inter text-[11px]">
                                    {convertToTitleCase(key)}
                                </p>
                                <p className="font-bold text-[12px] font-inter">
                                    {getDisplayValue(vc.credentialSubject[key])}
                                </p>
                            </div>
                        ))
                        : (
                            <div className="grid content-center justify-center w-[100%] h-[320px] text-[#000000] opacity-10">
                                <DocumentIcon/>
                            </div>
                        )
                }
            </div>
            <div style={{
                display: 'grid',
                placeContent: 'center'
            }}>
                <StyledButton style={{margin: "24px auto"}} onClick={() => {
                    dispatch(goHomeScreen({}))
                }}>
                    Verify QR Code
                </StyledButton>
            </div>
        </div>
    );
}

export default VcDisplayCard;

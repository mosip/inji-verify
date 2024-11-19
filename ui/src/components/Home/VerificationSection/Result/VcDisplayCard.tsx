import React from 'react';
import {convertToId, convertToTitleCase, getDisplayValue} from "../../../../utils/misc";
import {Button} from "../commons/Button";
import { DocumentIcon } from '../../../../utils/theme-utils';
import {useAppDispatch} from "../../../../redux/hooks";
import {goToHomeScreen} from "../../../../redux/features/verification/verification.slice";

function VcDisplayCard({vc}: {vc: any}) {
    const dispatch = useAppDispatch();
    return (
        <div>
            <div className={`grid w-[340px] m-auto bg-white rounded-[12px] py-[5px] px-[15px] shadow-lg`}>
                {
                    vc ? Object.keys(vc.credentialSubject)
                        .filter(key => key?.toLowerCase() !== "id" && key?.toLowerCase() !== "type")
                        .map((key, index) => (
                            <div className={`py-2.5 px-1 xs:col-end-13 ${(index % 2 === 0) ? "lg:col-start-1 lg:col-end-6" : "lg:col-start-8 lg:col-end-13"}`} key={key}>
                                <p id={convertToId(key)} className="font-normal text-verySmallTextSize break-all">
                                    {convertToTitleCase(key)}
                                </p>
                                <p id={`${convertToId(key)}-value`} className="font-bold text-smallTextSize break-all">
                                    {getDisplayValue(vc.credentialSubject[key])}
                                </p>
                            </div>
                        ))
                        : (
                            <div className="grid content-center justify-center w-[100%] h-[320px] text-documentIcon">
                                <DocumentIcon/>
                            </div>
                        )
                }
            </div>
            <div className="grid content-center justify-center">
                <Button 
                id="verify-another-qr-code-button"
                title="Verify Another QR code"
                className="w-[200px] lg:w-[350px] mt-6 mb-20 lg:mb-6 mx-0 my-1.5 text-lgNormalTextSize inline-flex" 
                onClick={() => {
                    dispatch(goToHomeScreen({}))
                }}/>
            </div>
        </div>
    );
}

export default VcDisplayCard;

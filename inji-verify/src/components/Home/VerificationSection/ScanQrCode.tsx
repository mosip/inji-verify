import React from 'react';
import scanQr from "../../../assets/scanner-ouline.svg";
import qrIcon from "../../../assets/qr-code-icon.svg";
import {ReactComponent as TabScanIcon} from "../../../assets/tab-scan.svg";
import {ReactComponent as TabScanFillIcon} from "../../../assets/tab-scan-fill.svg";
import StyledButton from "./commons/StyledButton";
import {UploadQrCode} from "./UploadQrCode";
import {useAppDispatch} from "../../../redux/hooks";
import {qrReadInit} from "../../../redux/features/verification/verification.slice";
import {useVerificationFlowSelector} from "../../../redux/features/verification/verification.selector";
import {VerificationMethod} from "../../../types/data-types";

const ScanQrCode = () => {
    const dispatch = useAppDispatch();
    const {scanStatus, method} = useVerificationFlowSelector(state => ({scanStatus: state.qrReadResult?.status, method: state.method}));

    return (
        <div className="flex flex-col pt-0 pb-[100px] lg:py-[78px] px-0 lg:px-[104px] text-center content-center justify-center">
            <div className="xs:col-end-13 mb-11 font-bold  text-[20px]">
                <h4 className="font-bold text-[20px]  px-0 py-[3px]">
                    {method as VerificationMethod === "UPLOAD" ? "Upload QR Code" : "Scan QR Code"}
                </h4>
                <p className="font-normal  text-[16px] text-[#717171] py-[3px] px-0">
                    {method as VerificationMethod === "UPLOAD" ? "Upload a file that contains a QR code"
                        : "Tap “Scan” to start scanning the document or card with a QR code"}
                </p>
            </div>
            <div className="xs:col-end-13">
                <div
                    className={`relative grid content-center justify-center w-[275px] lg:w-[350px] aspect-square my-1.5 mx-auto bg-cover`}
                    style={{backgroundImage: `url(${scanQr})`}}>
                    <div
                        className="grid bg-primary opacity-5 rounded-[12px] w-[250px] lg:w-[320px] aspect-square content-center justify-center">
                    </div>
                    <div className="absolute top-[58px] left-[98px] lg:top-[50%] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]">
                        <img src={qrIcon} className="w-[78px] lg:w-[100px]"/>
                    </div>
                    {
                        method === "SCAN" ? (<StyledButton
                            icon={<TabScanFillIcon/>}
                            className='mx-0 my-1.5 w-[205px] lg:w-[350px] py-3.5 text-center inline-flex lg:hidden absolute top-[160px] left-[33px]'
                            fill={false}
                            onClick={() => dispatch(qrReadInit({method}))}>
                            Scan
                        </StyledButton>) : (
                            <UploadQrCode
                                className="w-[205px] lg:hidden absolute top-[160px] left-[33px]"
                                displayMessage="Upload"
                            />
                        )
                    }
                </div>
            </div>
            <div className="col-end-13">
                <StyledButton
                    icon={<TabScanIcon/>}
                    className='mx-0 my-1.5 w-[205px] lg:w-[350px] text-center hidden lg:inline-flex'
                    fill
                    onClick={() => dispatch(qrReadInit({method: "SCAN"}))}>
                    Scan QR Code
                </StyledButton>
            </div>
            <div className="col-end-13 hidden lg:inline-flex">
                <UploadQrCode
                    className="w-[350px]"
                    displayMessage={scanStatus === "FAILED" ? "Upload Another QR Code" : "Upload QR Code"}
                />
            </div>
            {
                scanStatus !== "FAILED" && (
                    <div className="grid text-center content-center justify-center">
                        <p className="font-normal text-[14px]  text-[#8E8E8E] w-[280px]">
                            Allowed file formats: PNG/JPEG/JPG/PDF <br/>Min Size : 10KB | Max Size : 5MB
                        </p>
                    </div>
                )
            }
        </div>
    );
}

export default ScanQrCode;

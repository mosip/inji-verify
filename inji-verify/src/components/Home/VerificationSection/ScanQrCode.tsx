import React from 'react';
import scanQr from "../../../assets/scanner-ouline.svg";
import qrIcon from "../../../assets/qr-code-icon.svg";
import {ReactComponent as TabScanIcon} from "../../../assets/tab-scan.svg";
import StyledButton from "./commons/StyledButton";
import {UploadQrCode} from "./UploadQrCode";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {qrReadInit} from "../../../redux/features/verificationSlice";

const ScanQrCode = () => {
    const dispatch = useAppDispatch();
    const scanStatus = useAppSelector(state => state.qrReadResult?.status);

    return (
        <div className="flex flex-col py-[78px] px-[104px] text-center content-center justify-center">
            <div className="xs:col-end-13 mb-11 font-bold font-inter text-[20px]">
                <h4 className="font-bold text-[20px] font-inter px-0 py-[3px]">
                    Scan QR Code or Upload an Image
                </h4>
                <p className="font-normal font-inter text-[16px] text-[#717171] py-[3px] px-0">
                    Please keep the QR code in the centre & clearly visible.
                </p>
            </div>
            <div className="xs:col-end-13">
                <div
                    className={`relative grid content-center justify-center xs:w-[45vw] md:w-[350px] xs:h-[45vw] md:h-[350px] my-1.5 mx-auto bg-cover`}
                    style={{backgroundImage: `url(${scanQr})`}}>
                    <div
                        className="grid bg-[#FF7F00] opacity-5 rounded-[12px] xs:w-[42vw] xs:h-[42vw] md:w-[320px] md:h-[320px] content-center justify-center">
                    </div>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <img src={qrIcon} className="w-[100px]"/>
                    </div>
                </div>
            </div>
            <div className="col-end-13">
                <StyledButton
                    icon={<TabScanIcon/>}
                    style={{margin: "6px 0", width: "350px", textAlign: 'center'}} fill
                    onClick={() => dispatch(qrReadInit({flow: "SCAN"}))}>
                    Scan the QR Code
                </StyledButton>
            </div>
            <div className="col-end-13">
                <UploadQrCode
                    displayMessage={scanStatus === "FAILED" ? "Upload Another QR Code" : "Upload QR Code"}
                />
            </div>
            {
                scanStatus !== "FAILED" && (
                    <div className="grid text-center content-center justify-center">
                        <p className="font-normal text-[14px] font-inter text-[#8E8E8E] w-[280px]">
                            Allowed file formats: PNG/JPEG/JPG <br/>Min Size : 10KB | Max Size : 5MB
                        </p>
                    </div>
                )
            }
        </div>
    );
}

export default ScanQrCode;

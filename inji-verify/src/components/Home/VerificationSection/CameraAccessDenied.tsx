import * as React from 'react';
import {ReactComponent as NoPhotographyIcon} from "../../../assets/no-photography-icon.svg";
import StyledButton from "./commons/StyledButton";
import {CSSProperties} from "react";

const style: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 570,
    backgroundColor: 'white',
    fontSize: '52px',
    display: "grid",
    placeItems: 'center',
    borderRadius: '20px',
    outline: 'none',
    padding: '38px'
};

const Modal = ({children}: any) => (
    <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
                {children}
            </div>
        </div>
    </div>
)

const Fade = ({children}: any) => (
    <div x-show="isOpen" className="fixed inset-0 flex items-center justify-center">
        <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
            {children}
        </div>
    </div>
)

const CameraAccessDenied = ({open, handleClose}: { open: boolean, handleClose: () => void }) => {
    return open ? (
        <Modal>
            <Fade>
                <div className="grid justify-items-center items-center text-center shadow-lg" style={style}>
                    <NoPhotographyIcon fontSize={"inherit"} className="text-primary my-3 mx-auto"/>
                    <p className="font-bold  text-[20px] my-3 mx-auto">
                        Camera Access Denied
                    </p>
                    <p className="font-normal text-[16px]  text-[#707070] my-3 mx-auto">
                        We need your camera to scan the code. Go to your browser settings and allow camera access for
                        this website.
                    </p>
                    <StyledButton
                        onClick={handleClose}
                        className="w-[180px] mx-auto my-[18px]"
                        fill={false}
                    >
                        Okay
                    </StyledButton>
                </div>
            </Fade>
        </Modal>
    ) : (<></>);
}

export default CameraAccessDenied;

import React from 'react';
import {useAppDispatch} from "../../../../redux/hooks";
import {useVerificationFlowSelector} from "../../../../redux/features/verification/verification.selector";
import {goHomeScreen, selectMethod} from "../../../../redux/features/verification/verification.slice";
import {VerificationMethod} from "../../../../types/data-types";

const Tab = ({active, label, disabled, onClick}: {active: boolean, label: string, disabled?: boolean, onClick?: () => void}) => {
    const activeTab = "bg-[#FF7F00] border-t-[6px] border-y-[#FF7F00] text-white";
    const inactiveTab = "bg-white text-black shadow-lg mt-[6px]";
    const disabledTab = "cursor-not-allowed text-gray-600 bg-gray-200 ";
    const toolTip = "absolute z-10 p-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 transition-opacity duration-300";
    const enabledTab = active ? activeTab : inactiveTab;
    return (<div>
        <button
            className={`w-[172px] md:w-[214px] py-4 focus:outline-none self-end rounded-t-xl ${disabled ? disabledTab : enabledTab}`}
            onClick={onClick}
        >
            {label}
        </button>
    </div>);
}

function VerificationMethodTabs(props: any) {
    const dispatch = useAppDispatch();
    const method = useVerificationFlowSelector(state => state.method);
    function switchToVerificationMethod(method: VerificationMethod) {dispatch(goHomeScreen({method}))}
    return (
        <div className="container mx-auto w-[100%] bg-[#F2FCFF] border-b-2 border-b-[#FF7F00] max-w-[100vw] overflow-x-scroll md:overflow-x-auto">
            <div className="flex flex-row items-center mx-auto justify-center">
                <div className="w-full">
                    <div className="flex space-x-0.5 border-gray-200 font-bold">
                        <Tab active={method === "UPLOAD"} label="Upload QR Code" onClick={() => switchToVerificationMethod("UPLOAD")}/>
                        <Tab active={method === "SCAN"} label="Scan the QR Code" onClick={() => switchToVerificationMethod("SCAN")}/>
                        <Tab active={false} label="VP Verification" disabled/>
                        <Tab active={false} label="BLE" disabled/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerificationMethodTabs;

import React from 'react';

const Tab = ({active, label, disabled}: {active: boolean, label: string, disabled?: boolean}) => {
    const activeTabClass = "bg-[#FF7F00] border-t-[6px] border-y-[#FF7F00] text-white";
    const inactiveTab = "bg-white text-black shadow-lg mt-[6px]";
    const disabledTab = "cursor-not-allowed text-gray-600";
    const toolTip = "absolute z-10 p-2 text-sm text-white bg-gray-800 rounded-lg opacity-0 transition-opacity duration-300";
    return (<div>
        <button
            className={`w-[172px] md:w-[214px] py-4 focus:outline-none rounded-t-xl ${active ? activeTabClass : inactiveTab}`}>
            {label}
        </button>
    </div>);
}

function VerificationMethodTabs(props: any) {
    return (
        <div className="container mx-auto w-[100%] bg-[#F2FCFF] border-b-2 border-b-[#FF7F00] max-w-[100vw] overflow-x-scroll">
            <div className="flex flex-col items-center mx-auto justify-center">
                <div className="w-full">
                    <div className="flex space-x-0.5 border-b border-gray-200 font-bold">
                        <Tab active label="Upload QR Code"/>
                        <Tab active={false} label="Scan the QR Code"/>
                        <Tab active={false} label="VP Verification" disabled/>
                        <Tab active={false} label="BLE" disabled/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerificationMethodTabs;

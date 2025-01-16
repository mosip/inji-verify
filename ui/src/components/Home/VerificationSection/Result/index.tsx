import React, { useState } from 'react';
import ResultSummary from "./ResultSummary";
import { useVerificationFlowSelector } from "../../../../redux/features/verification/verification.selector";
import { VcStatus } from "../../../../types/data-types";
import DisplayVcDetailsModal from './DisplayVcDetailsModal';
import DisplayVcDetailView from './DisplayVcDetailView';

const getVcStatusValue = (vcStatus: VcStatus)  => {return vcStatus.verificationStatus}

const Result = () => {
    const { vc, vcStatus } = useVerificationFlowSelector(state => state.verificationResult ?? { vc: null, vcStatus: null })
    const status = getVcStatusValue(vcStatus);
    const [isModalOpen, setModalOpen] = useState(false);
    const credentialType: string= vc.verifiableCredential.credential.credentialConfigurationId

    // validate vc and show success/failure component
    return (
        <div id="result-section" className="relative">
            <div className={`text-whiteText`}>
                <ResultSummary status={status} />
            </div>
            <div
                className={`absolute m-auto`}
                style={{
                    top: `106px`,
                    right: window.innerWidth >= 1024 ? `calc((50vw - 410px) / 2)` : `calc((100vw - 410px) / 2)`
                }}>
                <DisplayVcDetailView  vc={vc} onExpand={() => setModalOpen(true)} />
            </div>
            <DisplayVcDetailsModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                vc={vc}
                status={status}
                vcType={credentialType}
            />
        </div>
    );
}

export default Result;

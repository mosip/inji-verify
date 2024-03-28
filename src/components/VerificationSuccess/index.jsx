import React from 'react';
import Certificate from "./Certificate";

function VerificationSuccess({vc, back}) {
    return (
        <Certificate vc={vc} back={back}/>
    );
}

export default VerificationSuccess;

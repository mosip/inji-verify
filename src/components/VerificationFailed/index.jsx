import React from 'react';
import StyledButton from "../commons/StyledButton.js";

function VerificationFailed({back}) {
    return (
        <div style={{margin: "auto", width: "300px", textAlign: "center"}}>
            <img
                src="https://verify.cowin.gov.in/static/media/certificate-invalid.a9ac96af.svg"/>
            <p style={{fontWeight: 500, fontSize: "24px"}}>
                Certificate Invalid!
            </p>
            <StyledButton onClick={back}>
                Verify another certificate
            </StyledButton>
        </div>
    );
}

export default VerificationFailed;

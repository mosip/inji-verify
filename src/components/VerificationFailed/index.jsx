import React from 'react';
import StyledButton from "../commons/StyledButton.js";
import PropTypes from "prop-types";
import {StyledHeader, VerificationFailedContainer} from "./styles.js";

function VerificationFailed({back}) {
    return (
        <VerificationFailedContainer>
            <img
                src="https://verify.cowin.gov.in/static/media/certificate-invalid.a9ac96af.svg"/>
            <StyledHeader>
                Certificate Invalid!
            </StyledHeader>
            <StyledButton onClick={back}>
                Verify another certificate
            </StyledButton>
        </VerificationFailedContainer>
    );
}

VerificationFailed.propTypes = {
    back: PropTypes.func.isRequired
}

export default VerificationFailed;

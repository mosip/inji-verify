import React from 'react';
import Certificate from "./Certificate";
import PropTypes from "prop-types";

function VerificationSuccess({vc, back}) {
    return (
        <Certificate vc={vc} back={back}/>
    );
}

VerificationSuccess.propTypes = {
    vc: PropTypes.object.isRequired,
    back: PropTypes.func.isRequired
}

export default VerificationSuccess;

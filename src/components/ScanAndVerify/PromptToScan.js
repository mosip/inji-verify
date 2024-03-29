import React from 'react';
import StyledButton from "../commons/StyledButton.js";
import PropTypes from "prop-types";
import {PromptToScanContainer, StyledHeader} from "./styles.js";
import {DISPLAY_TEXT, SUPPORTED_LANGUAGE} from "../../utils/config.js";

function PromptToScan({setScanning}) {
    return (
        <PromptToScanContainer>
            <StyledHeader>
                {DISPLAY_TEXT[SUPPORTED_LANGUAGE].verifyCertificate}
            </StyledHeader>
            <StyledButton onClick={() => {setScanning(true)}}>
                <span>
                    {DISPLAY_TEXT[SUPPORTED_LANGUAGE].scanQr}
                </span>
                <img
                    style={{marginLeft: '1rem'}}
                    src='https://verify.cowin.gov.in/static/media/qr-code.0d1efb4c.svg'
                />
            </StyledButton>
        </PromptToScanContainer>
    );
}

PromptToScan.propTypes = {
    setScanning: PropTypes.func.isRequired
}

export default PromptToScan;

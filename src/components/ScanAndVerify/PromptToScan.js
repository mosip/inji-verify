import React from 'react';
import StyledButton from "../commons/StyledButton.js";

function PromptToScan({setScanning}) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'auto',
            width: '100%',
            padding: '0px 15px',
            margin: '0px auto'
        }}>
            <p style={{
                textAlign: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem',
                fontWeight: 500,
                lineHeight: 1.2,
                boxSizing: 'border-box'
            }}>
                Verify a certificate
            </p>
            <StyledButton onClick={() => {setScanning(true)}}>
                <span>
                    Scan QR code
                </span>
                <img
                    style={{marginLeft: '1rem'}}
                    src='https://verify.cowin.gov.in/static/media/qr-code.0d1efb4c.svg'
                />
            </StyledButton>
        </div>
    );
}

export default PromptToScan;

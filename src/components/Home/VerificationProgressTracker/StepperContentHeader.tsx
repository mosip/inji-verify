import React from 'react';
import {Box, Typography, useMediaQuery} from "@mui/material";

function StepperContentHeader(props: any) {
    const isTabletOrAbove = useMediaQuery("@media(min-width:600px)");
    console.log("Is tablet: ", isTabletOrAbove);
    return (
        <Box>
            <Typography variant='h4' style={{
                font: 'normal normal bold 26px/31px Inter',
                margin: '6px 0'
            }}>
                Verify your credentials in <span style={{color: '#FF7F00'}}>4 easy steps</span>
            </Typography>
            {
                isTabletOrAbove && (
                    <Typography variant='body1' style={{
                        font: 'normal normal normal 16px/21px Inter',
                        margin: '6px 0'
                    }}>
                        Credentials are digitally signed documents with tamper-evident QR codes. These QR codes can be easily verified using the Inji Verify app. Simply scan the QR code with your smartphone camera or use the dedicated verification tool on this page.
                    </Typography>
                )
            }
        </Box>
    );
}

export default StepperContentHeader;
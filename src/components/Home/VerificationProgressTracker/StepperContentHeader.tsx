import React from 'react';
import {Box, Typography} from "@mui/material";

function StepperContentHeader(props: any) {
    return (
        <Box>
            <Typography variant='h4' style={{fontSize: '26px', fontWeight: 'bold'}}>
                Verify your credentials in 4 easy steps
            </Typography>
            <Typography variant='body1'>
                Credentials are digitally signed documents with tamper-evident QR codes. These QR codes can be easily verified using the Inji Verify app. Simply scan the QR code with your smartphone camera or use the dedicated verification tool on this page.
            </Typography>
        </Box>
    );
}

export default StepperContentHeader;
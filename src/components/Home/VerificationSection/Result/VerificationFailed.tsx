import React from 'react';
import GppGoodIcon from "@mui/icons-material/GppGood";
import {Box, Typography} from "@mui/material";

function VerificationFailed(props: any) {
    return (
        <Box>
            <GppGoodIcon/>
            <Typography>
                Results
            </Typography>
            <Typography>
                Unfortunately, the given certificate is Invalid!
            </Typography>
        </Box>
    );
}

export default VerificationFailed;

import {Box, Divider, Typography} from "@mui/material";
import React from "react";

function Copyrights(props: any) {
    return (
        <Box style={{
            position: 'fixed',
            bottom: 0,
            width: '50%',// big screens, make it to 100% in small screens
            display: 'grid',
            placeContent: 'center',
            background: 'white'
        }}>
            <Divider style={{width: '40vw'}}/>
            <Typography style={{
                font: 'normal normal normal 14px/17px Inter',
                padding: '16px 0',
                color: '#707070',
                width: '100%',
                textAlign: 'center'
            }}>
                2024 © MOSIP - All rights reserved.
            </Typography>
        </Box>
    );
}

export default Copyrights;

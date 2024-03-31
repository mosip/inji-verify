import React from 'react';
import {Box, Typography} from "@mui/material";

function Navbar(props: any) {
    // Logo goes here
    return (
        <Box style={{height: "52px", margin: "60px 0"}}>
            <Typography style={{fontFamily: 'Inter', color: '#FF8F00'}}>
                Inji Logo comes here
            </Typography>
        </Box>
    );
}

export default Navbar;
